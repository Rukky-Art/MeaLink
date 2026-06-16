from notification.models import Notification

def create_notification(user, title, message):
    return Notification.objects.create(
        user=user,
        title=title,
        message=message
    )

def notify_donor_verified(user):
    return create_notification(
        user=user,
        title="Account Verified",
        message=(
            "Your donor account has been verified. "
            "You can now start posting food donations."
        )
    )

def notify_partner_verified(user):
    return create_notification(
        user=user,
        title="Account Verified",
        message=(
            "Your partner account has been verified. "
            "You can now start claiming food listings."
        )
    )

def notify_verification_rejected(user, reason=None):
    message = "Your verification request was not approved."

    if reason:
        message += f" Reason: {reason}"

    return create_notification(
        user=user,
        title="Verification Rejected",
        message=message
    )

def notify_password_changed(user):
    return create_notification(
        user=user,
        title="Password Updated",
        message="Your password was changed successfully."
    )

