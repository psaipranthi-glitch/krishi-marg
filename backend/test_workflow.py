# Basic smoke-test module; full API tests use a configured PostgreSQL test database.
from app.services.workflow import ALLOWED

def test_workflow_states():
    assert 'AGGREGATING' in ALLOWED['CREATED']
    assert 'DELIVERED' in ALLOWED['OUT_FOR_DELIVERY']
