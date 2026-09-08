# KRISHI MARG — SIH26033
### Perishability-Aware Agricultural Transportation & Logistics

Krishi Marg is a runnable full-stack hackathon prototype connecting **demand → supply → freshness → quality → vehicle → route → live delivery → impact analytics** for four commodities: onion, tomato, potato and spinach.

## Product story
**Right produce → Right vehicle → Right route → On time.**
The visual language is inspired by the supplied Krishi Marg reference screens: green agricultural identity, logistics blue accents, card-based control surfaces, mobile driver workflow, collection/packhouse/hub operations and a control-tower map. The reference images are not shipped or reused as product assets.

## Architecture
- Frontend: React + Vite + TypeScript + Tailwind CSS + Framer Motion + React Router + Zustand + Recharts + React-Leaflet.
- Backend: FastAPI + SQLAlchemy + SQLite (default; PostgreSQL is optional) + Pydantic + JWT + WebSockets.
- AI: explainable freshness scoring + backend-fed demand forecast + vehicle scoring.
- Optimization: Google OR-Tools VRP engine.
- Mapping: Leaflet + OpenStreetMap; locations come from SQLite (default; PostgreSQL is optional) seed data.

## Folder structure
```
KRISHI-MARG/
├── frontend/
├── backend/
├── database/
├── ml/
├── docs/
├── scripts/
├── docker-compose.yml
├── .env.example
└── README.md
```

## Prerequisites
- Python 3.11+
- Node.js 20+
- npm

**No Docker and no PostgreSQL installation are required.** The default database is SQLite, which is bundled with Python.

## Install — downloadless database setup
1. Copy `.env.example` to `backend/.env` if you want to customize environment values. The default SQLite URL already works without any database server.
2. Backend:
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.seed.seed
uvicorn app.main:app --reload --port 8000
```
3. Frontend in a second terminal:
```powershell
cd frontend
npm install
npm run dev
```
4. Open `http://localhost:5173`.

The first seed/start creates `backend/krishi_marg.db` automatically. There is no `docker compose` command in the normal setup.

**Optional:** `docker-compose.yml` contains a PostgreSQL profile for teams that later want a server-style database. It is not needed for the SIH demo.

## Demo credentials
All demo accounts use password **Krishi@123**:
- admin@krishimarg.local
- farmer@krishimarg.local
- customer@krishimarg.local
- driver@krishimarg.local
- collection@krishimarg.local
- package@krishimarg.local
- hub@krishimarg.local

Passwords are stored as bcrypt hashes in SQLite (default; PostgreSQL is optional).

## End-to-end judge demo (5–10 min)
1. Login as admin.
2. Click **Run full demo journey**. This creates a real order through the API, aggregates demand, matches supply, creates a route and advances the workflow state machine.
3. Show AI Copilot + demand/forecast charts.
4. Open customer role to create another tomato/onion/potato/spinach order.
5. Open collection role and run the quality recommendation; changing Grade A → B recalculates freshness and writes an audit record.
6. Open driver role: the WebSocket demo GPS moves the driver marker every 2 seconds. Click START TRIP → ARRIVED → PICKED UP → DELIVERED.
7. Open package/hub roles to show packaging, dispatch and route surfaces.
8. Show dynamic Leaflet map and impact KPIs.

## API
- `POST /api/auth/login`
- `GET /api/kpis`
- `GET /api/commodities`
- `GET /api/forecast`
- `GET /api/demand`
- `GET /api/map/locations`
- `POST /api/orders`
- `GET /api/orders`
- `POST /api/operations/aggregate`
- `POST /api/operations/match-farmer`
- `POST /api/operations/grade/{lot_id}`
- `GET /api/operations/vehicle-match/{order_id}`
- `POST /api/operations/route`
- `POST /api/ai/freshness`
- `POST /api/demo/run`
- `GET /api/traceability/{lot_code}`
- `GET /api/traceability/{lot_code}/qr`
- `WS /ws/tracking`
- Swagger UI: `http://localhost:8000/docs`

## WebSocket
`/ws/tracking` broadcasts driver updates containing `driver_id`, `lat`, `lon`, `speed_kmh`, and `eta_min`. The driver page and admin map consume the same socket, so movement is shared across roles.

## AI explanation
**Freshness:** shelf-life, harvest age, temperature deviation, handling delay, commodity sensitivity and grade produce freshness %, remaining life, spoilage risk and urgency. Urgency is used in vehicle scoring.

**Demand:** backend derives a baseline from persisted order quantities and applies commodity-specific trend factors. The response contains forecast quantity, trend and confidence and feeds Recharts; no chart array is hardcoded in React.

**Vehicle matching:** capacity is a hard constraint; distance, urgency and refrigerated compatibility contribute to a score and a human-readable reason.

## Route optimization
OR-Tools solves a small single-vehicle routing problem over live database coordinates. The route is persisted as `routes` + `route_stops`, returned by API, and can be rendered by the Leaflet UI. The implementation is intentionally lightweight for a hackathon; it is ready to extend with capacity/time-window dimensions.

## Database
The seed creates users, 10 farmers, 10 customers, 8 drivers, 10 vehicles, 3 collection centres, 2 package centres, 2 city hubs, four commodities, supply, a staged demo order and traceability lot.

## Testing
```bash
cd backend
pytest -q
```
The included smoke test validates the workflow transition contract. The API architecture is split into routers/services so endpoint-level tests can be added against a dedicated SQLite (default; PostgreSQL is optional) test database.

## Troubleshooting
- Database: delete `backend/krishi_marg.db` and rerun `python -m app.seed.seed` to recreate the local SQLite database.
- Backend import errors: activate the venv and run `pip install -r requirements.txt`.
- Port 8000 busy: use another port and set `VITE_API_URL` accordingly.
- Map blank: ensure internet access to OpenStreetMap tile servers.
- WebSocket not moving: verify backend is on port 8000 and browser console is not blocking mixed-content WebSockets.
- Reseed: stop the backend, delete `backend/krishi_marg.db`, then run `python -m app.seed.seed` again.
