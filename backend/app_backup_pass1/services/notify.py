from ..models import Notification, Alert

def notify(db, message, user_id=None, severity='info'):
    db.add(Notification(user_id=user_id,message=message,severity=severity))

def alert(db, alert_type, message, severity='warning'):
    db.add(Alert(alert_type=alert_type,message=message,severity=severity))
