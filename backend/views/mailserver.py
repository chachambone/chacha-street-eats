from flask_mail import Message
from flask import current_app

def send_email(username, recipient):
    msg = Message(
        "Welcome to Chacha Street Eats!",
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[recipient]
    )
    msg.body = f"Hi {username},\n\nThanks for joining Chacha Street Eats! Your Kenyan street food adventure starts now. 🔥🇰🇪\n\nBest,\nChacha Team"
    current_app.extensions['mail'].send(msg)
    print(f"Email sent to {recipient}")