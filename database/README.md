# Database
PostgreSQL 16 is provisioned by `docker-compose.yml`. SQLAlchemy creates the 25+ application tables at backend startup and `python -m app.seed.seed` inserts the demo network.
