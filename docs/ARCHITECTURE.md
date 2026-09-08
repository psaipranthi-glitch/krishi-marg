# Krishi Marg architecture

```text
Customer / Farmer / Driver / Operations UI
                │
        REST + WebSocket
                │
           FastAPI API
     ┌──────────┼──────────┐
  Workflow     AI       Optimization
     │          │             │
     └──────── SQLAlchemy ────┘
                │
           PostgreSQL
                │
      Map coordinates / GPS
```

The core design principle is that AI outputs are operational signals, not isolated demos: freshness urgency influences matching; demand aggregation drives supply matching; quality grade changes price; route results are persisted; GPS updates are shared with admin/customer/driver surfaces.
