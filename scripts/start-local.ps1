# Krishi Marg — zero-database-install local launcher
# Requires only Python and Node.js/npm. SQLite is bundled with Python.
Set-Location "$PSScriptRoot\..\backend"
if (!(Test-Path .venv)) { python -m venv .venv }
. .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.seed.seed
Start-Process powershell -ArgumentList '-NoExit','-Command','cd "$PWD"; . .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000'
Set-Location ..\frontend
npm install
npm run dev
