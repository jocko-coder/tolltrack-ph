import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app, init_db

init_db()          # runs on every cold start (idempotent)
handler = app      # Vercel WSGI entry point
