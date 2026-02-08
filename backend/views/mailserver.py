from flask_mail import Message
from flask import current_app

def send_email(username, recipient):
    """
    Sends welcome email to new users (real implementation).
    """
    try:
        msg = Message(
            "Welcome to Chacha Street Eats!",
            sender=current_app.config['MAIL_USERNAME'],
            recipients=[recipient]
        )
        msg.body = f"Hi {username},\n\nThanks for joining Chacha Street Eats! Your Kenyan street food adventure starts now. 🔥🇰🇪\n\nBest,\nChacha Team"
        current_app.extensions['mail'].send(msg)
        print(f"Welcome email sent to {recipient}")
    except Exception as e:
        print(f"Failed to send welcome email: {e}")

def send_manager_invite_email(name, email, is_existing_user=False, password=None):
    """
    Sends invitation to new/existing managers (dummy for now).
    Replace with real logic later.
    """
    try:
        msg = Message(
            "You're Invited to Join Chacha Street Eats as Manager!",
            sender=current_app.config['MAIL_USERNAME'],
            recipients=[email]
        )
        
        if is_existing_user:
            msg.body = (
                f"Hi {name},\n\n"
                "Your account has been upgraded to Manager role!\n"
                "You can now manage orders, menu, and more.\n\n"
                "Login at: http://localhost:3000/login\n\n"
                "Best,\nChacha Team"
            )
        else:
            msg.body = (
                f"Hi {name},\n\n"
                "You've been invited to join Chacha Street Eats as a Manager!\n"
                "Default password: {password}\n"
                "Please login and change it immediately.\n\n"
                "Login at: http://localhost:3000/login\n\n"
                "Best,\nChacha Team"
            )
        
        current_app.extensions['mail'].send(msg)
        print(f"Manager invite email sent to {email}")
    except Exception as e:
        print(f"Failed to send manager invite: {e}")