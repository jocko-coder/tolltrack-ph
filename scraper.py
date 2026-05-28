"""
Scraper module — EasyTrip CAMS & AutoSweep.
Stateless functions; no file I/O. Returns plain Python objects.
"""

import re
import requests
from bs4 import BeautifulSoup

BROWSER_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

ET_LOGIN_PAGE = "https://myeasytripcams.easytrip.ph/CAMS/Account/Login"
ET_LOGIN_POST = "https://myeasytripcams.easytrip.ph/CAMS/?ReturnUrl=%2FCAMS%2FCustomer%2FIndex"
ET_DASHBOARD  = "https://myeasytripcams.easytrip.ph/CAMS/Customer/Index"

AS_BASE       = "https://autosweeprfidapps.com/customerportal"
AS_LOGIN_PAGE = AS_BASE + "/"
AS_LOGIN_POST = AS_BASE + "/login"
AS_DASHBOARD  = AS_BASE + "/dashboard"
AS_BALANCE_EP = AS_BASE + "/balance"


def _new_session():
    s = requests.Session()
    s.headers["User-Agent"] = BROWSER_UA
    return s


def _token(html, field):
    tag = BeautifulSoup(html, "html.parser").find("input", {"name": field})
    return tag["value"] if tag else None


def _parse_balance(html):
    soup = BeautifulSoup(html, "html.parser")
    php_re = re.compile(r"(?:PHP|₱|Php)\s*([\d,]+\.?\d*)", re.I)
    bal_re = re.compile(
        r"(?:balance|available|remaining)[^:]*:\s*(?:PHP|₱|Php)?\s*([\d,]+\.?\d*)", re.I
    )
    for tag in soup.find_all(["span", "div", "td", "p", "h2", "h3", "h4", "b", "strong", "label"]):
        text = tag.get_text(strip=True)
        for pat in (bal_re, php_re):
            m = pat.search(text)
            if m:
                try:
                    return float(m.group(1).replace(",", ""))
                except ValueError:
                    pass
    return None


# ── EasyTrip ───────────────────────────────────────────────────────────────────

def easytrip_login(username, password):
    s = _new_session()
    resp = s.get(ET_LOGIN_PAGE, timeout=30)
    resp.raise_for_status()

    csrf = _token(resp.text, "__RequestVerificationToken")
    if not csrf:
        raise ValueError("Could not find EasyTrip CSRF token — portal may have changed.")

    resp = s.post(
        ET_LOGIN_POST,
        data={"__RequestVerificationToken": csrf, "UserName": username, "Password": password},
        allow_redirects=True,
        timeout=30,
    )

    if "Customer" in resp.url:
        return s, resp.text

    err = BeautifulSoup(resp.text, "html.parser").find("span", {"id": "tbValidationText"})
    if err and err.get_text(strip=True):
        raise ValueError(err.get_text(strip=True))
    raise ValueError("Login failed — check your EasyTrip username and password.")


def easytrip_balance(html):
    return _parse_balance(html)


def easytrip_session_valid(session):
    try:
        return session.get(ET_DASHBOARD, timeout=15, allow_redirects=False).status_code == 200
    except Exception:
        return False


# ── AutoSweep ──────────────────────────────────────────────────────────────────

def autosweep_login(email, password):
    s = _new_session()
    resp = s.get(AS_LOGIN_PAGE, timeout=30)
    resp.raise_for_status()

    csrf = _token(resp.text, "_token")
    if not csrf:
        raise ValueError("Could not find AutoSweep CSRF token — portal may have changed.")

    resp = s.post(
        AS_LOGIN_POST,
        data={"_token": csrf, "email": email, "password": password},
        allow_redirects=True,
        timeout=30,
    )

    if "/dashboard" in resp.url:
        return s, resp.text

    soup = BeautifulSoup(resp.text, "html.parser")
    for el in soup.find_all(class_=re.compile(r"alert|error|danger|invalid", re.I)):
        msg = el.get_text(strip=True)
        if msg:
            raise ValueError(msg)
    raise ValueError("Login failed — check your AutoSweep email and password.")


def autosweep_balance(session, html):
    bal = _parse_balance(html)
    if bal is not None:
        return bal

    csrf = _token(html, "_token")
    if not csrf:
        try:
            r = session.get(AS_DASHBOARD, timeout=15)
            csrf = _token(r.text, "_token")
        except Exception:
            pass

    if csrf:
        try:
            r = session.post(AS_BALANCE_EP, data={"_token": csrf}, timeout=20)
            if r.status_code == 200:
                try:
                    data = r.json()
                    for key in ["balance", "available_balance", "Balance", "Amount"]:
                        if key in data:
                            return float(str(data[key]).replace(",", ""))
                    if isinstance(data, list) and data:
                        item = data[0]
                        if isinstance(item, dict):
                            for key in ["balance", "Balance", "amount"]:
                                if key in item:
                                    return float(str(item[key]).replace(",", ""))
                except Exception:
                    m = re.search(r"(?:PHP|₱|Php)\s*([\d,]+\.?\d*)", r.text, re.I)
                    if m:
                        return float(m.group(1).replace(",", ""))
        except Exception:
            pass

    return None


def autosweep_session_valid(session):
    try:
        return session.get(AS_DASHBOARD, timeout=15, allow_redirects=False).status_code == 200
    except Exception:
        return False
