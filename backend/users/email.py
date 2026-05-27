from django.core.mail import send_mail
from django.conf import settings


def send_verification_email(user, token):

    verify_link = f"http://localhost:8000/api/users/verify-email?token={token}"

    send_mail(
        subject="Verify your MeaLink email",
        message=f"""
        
        Hi {user.name},

        Welcome to MeaLink!
        
        Please verify your email address by clicking the link below:

        {verify_link}

        This link expires in 1 hour.

        The MeaLink Team
        """,

        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        # html_message="<strong>it works!</strong>",
    )

def send_password_reset_email(user, token):

    reset_link = f"http://localhost:8000/api/users/reset-password?token={token}"

    send_mail(
        subject="Reset your MeaLink password",
        message=f"""
        
        Hi {user.name},

        We received a request to reset your password for your MeaLink account.

        Please click the link below to reset your password:

        {reset_link}

        The MeaLink Team
        """,

        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )

