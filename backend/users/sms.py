import africastalking
from django.conf import settings

def send_sms(phone_number, message):
    try:
        africastalking.initialize(
            username=settings.AT_USERNAME,
            api_key=settings.AT_API_KEY
        )
        sms = africastalking.SMS
        response = sms.send(message, [phone_number])
        print("SMS sent:", response)
        return True
    except Exception as e:
        print(f"SMS error: {e}")
        return False