"""
TollTrack PH — Web App
Local dev  : SQLite  (auto-created)
Production : PostgreSQL via DATABASE_URL  (Vercel + Neon)
Scheduling : Vercel Cron → POST /api/cron  (or any external cron hitting that URL)
"""

import json, os, pickle, re, sqlite3
from datetime import datetime
from functools import wraps
from pathlib import Path

import requests
from cryptography.fernet import Fernet
from flask import (Flask, flash, jsonify, redirect, render_template,
                   request, session, url_for)
from werkzeug.security import check_password_hash, generate_password_hash

import scraper

# ── Paths ──────────────────────────────────────────────────────────────────────
_ROOT = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, template_folder=os.path.join(_ROOT, 'templates'))

# ── Secret key ────────────────────────────────────────────────────────────────
def _load_secret_key():
    val = os.environ.get('SECRET_KEY')
    if val:
        return val
    f = Path(_ROOT) / '.secret_key'
    if f.exists():
        return f.read_text().strip()
    key = os.urandom(32).hex()
    try:
        f.write_text(key); os.chmod(f, 0o600)
    except OSError:
        pass
    return key

app.secret_key = _load_secret_key()

# ── Fernet key ────────────────────────────────────────────────────────────────
def _load_fernet_key():
    val = os.environ.get('FERNET_KEY')
    if val:
        return val.encode() if isinstance(val, str) else val
    f = Path(_ROOT) / '.fernet_key'
    if f.exists():
        return f.read_bytes().strip()
    key = Fernet.generate_key()
    try:
        f.write_bytes(key); os.chmod(f, 0o600)
    except OSError:
        pass
    return key

_fernet = Fernet(_load_fernet_key())

# ── Database ───────────────────────────────────────────────────────────────────
_DATABASE_URL = os.environ.get('DATABASE_URL', '')
_DB_FILE      = os.path.join(_ROOT, 'tolltrack.db')


class _DB:
    """
    Thin wrapper that unifies sqlite3 (local) and psycopg2 (production).
    Use as a context manager: rows are committed on clean exit, rolled back on error.
    """

    def __init__(self):
        if _DATABASE_URL:
            import psycopg2, psycopg2.extras
            self._conn = psycopg2.connect(
                _DATABASE_URL,
                cursor_factory=psycopg2.extras.RealDictCursor
            )
            self._pg = True
        else:
            self._conn = sqlite3.connect(_DB_FILE)
            self._conn.row_factory = sqlite3.Row
            self._conn.execute("PRAGMA journal_mode=WAL")
            self._pg = False

    def execute(self, sql, params=()):
        if self._pg:
            sql = sql.replace('?', '%s')
            cur = self._conn.cursor()
            cur.execute(sql, params)
            return cur
        return self._conn.execute(sql, params)

    def commit(self):
        self._conn.commit()

    def close(self):
        self._conn.close()

    def __enter__(self):
        return self

    def __exit__(self, exc, *_):
        self._conn.rollback() if exc else self._conn.commit()
        self._conn.close()


def get_db():
    return _DB()


def init_db():
    AI = 'SERIAL PRIMARY KEY'          if _DATABASE_URL else 'INTEGER PRIMARY KEY AUTOINCREMENT'
    TS = 'TIMESTAMPTZ DEFAULT NOW()'   if _DATABASE_URL else 'TEXT DEFAULT CURRENT_TIMESTAMP'

    stmts = [
        f"""CREATE TABLE IF NOT EXISTS users (
            id            {AI},
            email         TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at    {TS}
        )""",
        f"""CREATE TABLE IF NOT EXISTS toll_accounts (
            id               {AI},
            user_id          INTEGER NOT NULL,
            portal           TEXT NOT NULL,
            credentials_enc  TEXT NOT NULL,
            alert_threshold  REAL DEFAULT 200,
            telegram_token   TEXT,
            telegram_chat_id TEXT,
            updated_at       {TS},
            UNIQUE(user_id, portal)
        )""",
        f"""CREATE TABLE IF NOT EXISTS portal_sessions (
            id          {AI},
            user_id     INTEGER NOT NULL,
            portal      TEXT NOT NULL,
            cookies_enc TEXT NOT NULL,
            updated_at  {TS},
            UNIQUE(user_id, portal)
        )""",
        f"""CREATE TABLE IF NOT EXISTS balance_snapshots (
            id         {AI},
            user_id    INTEGER NOT NULL,
            portal     TEXT NOT NULL,
            balance    REAL,
            error      TEXT,
            scraped_at {TS}
        )""",
    ]
    with get_db() as conn:
        for stmt in stmts:
            conn.execute(stmt)


# ── Encryption helpers ─────────────────────────────────────────────────────────

def enc_json(data):
    return _fernet.encrypt(json.dumps(data).encode()).decode()

def dec_json(token):
    return json.loads(_fernet.decrypt(token.encode()).decode())

def enc_cookies(cookies):
    return _fernet.encrypt(pickle.dumps(cookies)).decode()

def dec_cookies(token):
    return pickle.loads(_fernet.decrypt(token.encode()))


# ── Auth helpers ───────────────────────────────────────────────────────────────

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated


# ── Balance check ──────────────────────────────────────────────────────────────

def _restore_session(cookies_enc):
    cookies = dec_cookies(cookies_enc)
    s = requests.Session()
    s.headers['User-Agent'] = scraper.BROWSER_UA
    for name, val in cookies.items():
        s.cookies.set(name, val)
    return s


def run_check_for_user(user_id, portal):
    with get_db() as conn:
        acct = conn.execute(
            'SELECT * FROM toll_accounts WHERE user_id=? AND portal=?',
            (user_id, portal)
        ).fetchone()
        if not acct:
            return None, 'Not configured'

        sess_row = conn.execute(
            'SELECT * FROM portal_sessions WHERE user_id=? AND portal=?',
            (user_id, portal)
        ).fetchone()

    creds = dec_json(acct['credentials_enc'])
    portal_session = html = None

    if sess_row:
        try:
            portal_session = _restore_session(sess_row['cookies_enc'])
            valid = (scraper.easytrip_session_valid(portal_session)
                     if portal == 'easytrip'
                     else scraper.autosweep_session_valid(portal_session))
            if valid:
                url = scraper.ET_DASHBOARD if portal == 'easytrip' else scraper.AS_DASHBOARD
                html = portal_session.get(url, timeout=30).text
            else:
                portal_session = None
        except Exception:
            portal_session = None

    if portal_session is None:
        try:
            if portal == 'easytrip':
                portal_session, html = scraper.easytrip_login(
                    creds['username'], creds['password'])
            else:
                portal_session, html = scraper.autosweep_login(
                    creds['email'], creds['password'])
            with get_db() as conn:
                conn.execute(
                    """INSERT INTO portal_sessions (user_id, portal, cookies_enc, updated_at)
                       VALUES (?,?,?,?)
                       ON CONFLICT(user_id, portal) DO UPDATE SET
                           cookies_enc=excluded.cookies_enc,
                           updated_at=excluded.updated_at""",
                    (user_id, portal, enc_cookies(dict(portal_session.cookies)),
                     datetime.utcnow().isoformat())
                )
        except Exception as e:
            return None, str(e)

    try:
        balance = (scraper.easytrip_balance(html) if portal == 'easytrip'
                   else scraper.autosweep_balance(portal_session, html))
    except Exception:
        balance = None

    error = None if balance is not None else (
        'Balance not found in page — run the debug command from the CLI for help.')

    with get_db() as conn:
        conn.execute(
            'INSERT INTO balance_snapshots (user_id, portal, balance, error) VALUES (?,?,?,?)',
            (user_id, portal, balance, error)
        )

    if balance is not None and acct['telegram_token'] and acct['telegram_chat_id']:
        if balance < acct['alert_threshold']:
            label = 'EasyTrip' if portal == 'easytrip' else 'AutoSweep'
            _send_telegram(
                acct['telegram_token'], acct['telegram_chat_id'],
                f'⚠️ *{label} Low Balance*\nPHP {balance:,.2f} — reload before your next trip.'
            )

    return balance, error


def run_all_checks():
    with get_db() as conn:
        rows = conn.execute(
            'SELECT DISTINCT user_id, portal FROM toll_accounts'
        ).fetchall()
    for row in rows:
        try:
            run_check_for_user(row['user_id'], row['portal'])
        except Exception:
            pass


def _send_telegram(token, chat_id, text):
    try:
        requests.post(
            f'https://api.telegram.org/bot{token}/sendMessage',
            json={'chat_id': chat_id, 'text': text, 'parse_mode': 'Markdown'},
            timeout=10,
        )
    except Exception:
        pass


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return redirect(url_for('dashboard') if 'user_id' in session else url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email    = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm  = request.form.get('confirm', '')

        if not email or not password:
            flash('Email and password are required.', 'error')
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            flash('Enter a valid email address.', 'error')
        elif len(password) < 8:
            flash('Password must be at least 8 characters.', 'error')
        elif password != confirm:
            flash('Passwords do not match.', 'error')
        else:
            try:
                with get_db() as conn:
                    conn.execute(
                        'INSERT INTO users (email, password_hash) VALUES (?,?)',
                        (email, generate_password_hash(password, method='pbkdf2:sha256'))
                    )
                flash('Account created! Please log in.', 'success')
                return redirect(url_for('login'))
            except Exception:
                flash('An account with that email already exists.', 'error')

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email    = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        with get_db() as conn:
            user = conn.execute('SELECT * FROM users WHERE email=?', (email,)).fetchone()
        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['email']   = user['email']
            return redirect(url_for('dashboard'))
        flash('Incorrect email or password.', 'error')
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


@app.route('/dashboard')
@login_required
def dashboard():
    user_id = session['user_id']
    with get_db() as conn:
        accounts = conn.execute(
            'SELECT * FROM toll_accounts WHERE user_id=?', (user_id,)
        ).fetchall()
        snapshots = {}
        for acct in accounts:
            row = conn.execute(
                """SELECT balance, error, scraped_at FROM balance_snapshots
                   WHERE user_id=? AND portal=? ORDER BY scraped_at DESC LIMIT 1""",
                (user_id, acct['portal'])
            ).fetchone()
            snapshots[acct['portal']] = row
    return render_template('dashboard.html', accounts=accounts,
                           snapshots=snapshots, email=session['email'])


@app.route('/setup', methods=['GET', 'POST'])
@login_required
def setup():
    user_id = session['user_id']

    if request.method == 'POST':
        portal    = request.form.get('portal')
        threshold = float(request.form.get('threshold') or 200)
        tg_token  = request.form.get('telegram_token', '').strip() or None
        tg_chat   = request.form.get('telegram_chat_id', '').strip() or None

        if portal == 'easytrip':
            username = request.form.get('username', '').strip()
            password = request.form.get('password', '')
            if not username or not password:
                flash('Username and password are required.', 'error')
                return redirect(url_for('setup'))
            try:
                s, _ = scraper.easytrip_login(username, password)
                with get_db() as conn:
                    conn.execute(
                        """INSERT INTO portal_sessions (user_id, portal, cookies_enc, updated_at)
                           VALUES (?,?,?,?)
                           ON CONFLICT(user_id, portal) DO UPDATE SET
                               cookies_enc=excluded.cookies_enc,
                               updated_at=excluded.updated_at""",
                        (user_id, portal, enc_cookies(dict(s.cookies)),
                         datetime.utcnow().isoformat())
                    )
            except Exception as e:
                flash(f'EasyTrip login test failed: {e}', 'error')
                return redirect(url_for('setup'))
            creds = {'username': username, 'password': password}

        elif portal == 'autosweep':
            email    = request.form.get('as_email', '').strip()
            password = request.form.get('password', '')
            if not email or not password:
                flash('Email and password are required.', 'error')
                return redirect(url_for('setup'))
            try:
                s, _ = scraper.autosweep_login(email, password)
                with get_db() as conn:
                    conn.execute(
                        """INSERT INTO portal_sessions (user_id, portal, cookies_enc, updated_at)
                           VALUES (?,?,?,?)
                           ON CONFLICT(user_id, portal) DO UPDATE SET
                               cookies_enc=excluded.cookies_enc,
                               updated_at=excluded.updated_at""",
                        (user_id, portal, enc_cookies(dict(s.cookies)),
                         datetime.utcnow().isoformat())
                    )
            except Exception as e:
                flash(f'AutoSweep login test failed: {e}', 'error')
                return redirect(url_for('setup'))
            creds = {'email': email, 'password': password}

        else:
            flash('Invalid portal.', 'error')
            return redirect(url_for('setup'))

        with get_db() as conn:
            conn.execute(
                """INSERT INTO toll_accounts
                       (user_id, portal, credentials_enc, alert_threshold,
                        telegram_token, telegram_chat_id, updated_at)
                   VALUES (?,?,?,?,?,?,?)
                   ON CONFLICT(user_id, portal) DO UPDATE SET
                       credentials_enc=excluded.credentials_enc,
                       alert_threshold=excluded.alert_threshold,
                       telegram_token=excluded.telegram_token,
                       telegram_chat_id=excluded.telegram_chat_id,
                       updated_at=excluded.updated_at""",
                (user_id, portal, enc_json(creds), threshold,
                 tg_token, tg_chat, datetime.utcnow().isoformat())
            )

        flash(f'{portal.title()} account saved and verified.', 'success')
        return redirect(url_for('dashboard'))

    with get_db() as conn:
        existing = {
            row['portal']: row
            for row in conn.execute(
                'SELECT * FROM toll_accounts WHERE user_id=?', (user_id,)
            ).fetchall()
        }
    return render_template('setup.html', existing=existing, email=session['email'])


@app.route('/remove/<portal>', methods=['POST'])
@login_required
def remove_portal(portal):
    uid = session['user_id']
    with get_db() as conn:
        conn.execute('DELETE FROM toll_accounts    WHERE user_id=? AND portal=?', (uid, portal))
        conn.execute('DELETE FROM portal_sessions  WHERE user_id=? AND portal=?', (uid, portal))
    flash(f'{portal.title()} account removed.', 'success')
    return redirect(url_for('dashboard'))


@app.route('/refresh/<portal>', methods=['POST'])
@login_required
def refresh(portal):
    balance, error = run_check_for_user(session['user_id'], portal)
    if error and balance is None:
        flash(f'Could not read {portal} balance: {error}', 'error')
    else:
        flash(f'{portal.title()} balance updated: PHP {balance:,.2f}', 'success')
    return redirect(url_for('dashboard'))


@app.route('/api/history/<portal>')
@login_required
def api_history(portal):
    with get_db() as conn:
        rows = conn.execute(
            """SELECT balance, scraped_at FROM balance_snapshots
               WHERE user_id=? AND portal=? AND balance IS NOT NULL
               ORDER BY scraped_at ASC LIMIT 60""",
            (session['user_id'], portal)
        ).fetchall()
    return jsonify([{'balance': r['balance'], 'time': r['scraped_at']} for r in rows])


@app.route('/api/cron', methods=['GET', 'POST'])
def cron():
    """
    Called by Vercel Cron (or any external cron service) every hour.
    Vercel automatically sends Authorization: Bearer <CRON_SECRET>.
    Set CRON_SECRET env var in Vercel dashboard to secure this endpoint.
    """
    secret = os.environ.get('CRON_SECRET', '')
    if secret:
        auth = request.headers.get('Authorization', '').replace('Bearer ', '')
        if auth != secret:
            return jsonify({'error': 'Unauthorized'}), 401
    run_all_checks()
    return jsonify({'ok': True, 'time': datetime.utcnow().isoformat()})


# ── Local dev entry ────────────────────────────────────────────────────────────

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5001))
    print(f'\n  TollTrack PH running at http://127.0.0.1:{port}\n')
    app.run(host='0.0.0.0', port=port, debug=False)
