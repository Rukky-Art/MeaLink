from twilio.rest import Client
from django.conf import settings

def send_whatsapp_message(to_number, message):
    """
    Sends a WhatsApp message via Twilio
    to_number format: '+2348012345678' (with country code)
    """
    try:
        client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )

        message = client.messages.create(
            from_=settings.TWILIO_WHATSAPP_NUMBER,
            to=f'whatsapp:{to_number}',
            body=message
        )
        return True
    except Exception as e:
        print(f"WhatsApp error: {e}")
        return False