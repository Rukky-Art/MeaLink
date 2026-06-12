# food/ussd.py
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from food.models import Food
from claims.models import Claim
from django.contrib.auth import get_user_model

User = get_user_model()

def main_menu():
    return (
        "CON Welcome to MeaLink 🌱\n"
        "1. View Available Food\n"
        "2. My Active Claims\n"
        "3. Claim Food by ID\n"
        "0. Exit"
    )

def get_city_listings(city):
    return Food.objects.filter(
        status='available',
        pickup_city__iexact=city
    ).order_by('pickup_end_time')

@csrf_exempt
def ussd_handler(request):
    session_id = request.POST.get('sessionId', '')
    phone_number = request.POST.get('phoneNumber', '')
    text = request.POST.get('text', '')

    try:
        user = User.objects.get(phone_number=phone_number)

        if user.role not in ['partner']:
            return HttpResponse(
                "END Only partners can use MeaLink USSD.",
                content_type='text/plain'
            )
    except User.DoesNotExist:
        return HttpResponse(
            "END Phone number not registered.\nSign up at mea-link.vercel.app/",
            content_type='text/plain'
        )

    user_input = text.split('*') if text else []
    depth = len(user_input)

    # ── MAIN MENU ──
    if text == "":
        response = main_menu()
    
    # ── EXIT ──
    elif text == "0":
        response = "END Thank you for using MeaLink! 🌱"


# ─── MENU LEVEL 1 ───

    # ─── VIEW AVAILABLE FOOD ───
    elif user_input[0] == "1" and depth == 1:
        listings = get_city_listings(user.city)

        if listings:
            response = f"CON Food available in {user.city}:\n"
            for i, listing in enumerate(listings, 1):
                response += f"{i}. {listing.food_type} ({listing.quantity_estimated} {listing.quantity_unit})\n"
            response += "\n0.Enter number to view details"
        else:
            response = f"END No food available in {user.city} right now.\nCheck back soon!"

    # ─── MY ACTIVE CLAIMS ───
    elif user_input[0] == "2" and depth == 1:
        claims = Claim.objects.filter(
            claimer=user,
            status='pending'
        ).select_related('food')[:5]

        if claims:
            response = "CON Your active claims:\n"
            for i, claim in enumerate(claims, 1):
                response += f"{i}. {claim.food.food_type}\n"
                response += f"   Code: {claim.pickup_code}\n"
                response += f"   Pickup: {claim.food.pickup_address}\n"
            response += "\nDial again to return to menu"
        else:
            response = "END You have no active claims right now."

    # ─── CLAIM FOOD BY ID ───
    elif user_input[0] == "3" and depth == 1:
        response = "CON Enter food listing ID:\n(shown in Available food detail)"


# ─── MENU LEVEL 2 ───

    # ─── VIEW FOOD DETAILS ───
    elif user_input[0] == "1" and depth == 2:
        try:
            index = int(user_input[1]) - 1
            listings = get_city_listings(user.city)

            if 0 <= index < len(listings):
                listing = listings[index]
                response = f"CON {listing.food_type}\n"
                response += f"Qty: {listing.quantity_estimated} {listing.quantity_unit}\n"
                response += f"Addr: {listing.pickup_address}\n"
                response += f"Until: {listing.pickup_end_time.strftime('%H:%M %d %b')}\n"
                response += f"Contact: {listing.contact_person_phone}\n\n"
                response += f"1. Claim this food (ID: {listing.id})\n"
                response += "Any other key: Exit"
            else:
                response = "END Invalid selection. Please try again."
        except (ValueError, IndexError):
            response = "END Invalid input. Please try again."

     # ── VIEW FOOD BY ID ──
    elif user_input[0] == "3" and depth == 2:
        try:
            food_id = int(user_input[1])
            food = Food.objects.get(id=food_id, status='available')

            response = f"CON {food.food_type}\n"
            response += f"Qty: {food.quantity_estimated} {food.quantity_unit}\n"
            response += f"Addr: {food.pickup_address}\n"
            response += f"Until: {food.pickup_end_time.strftime('%H:%M %d %b')}\n"
            response += "1. Confirm claim\n"
            response += "Any other key: Exit"

        except Food.DoesNotExist:
            response = "END Food not found or already claimed."
        except ValueError:
            response = "END Invalid ID. Please enter a number."


 # ─── MENU LEVEL 3 — CLAIM CONFIRMATION ───

    # ─── CONFIRM CLAIM FROM LISTING DETAIL ───
    elif user_input[0] == "1" and depth == 3 and user_input[2] == "1":
        try:
            index = int(user_input[1]) - 1
            listings = get_city_listings(user.city)

            if 0 <= index < len(listings):
                food = listings[index]

                # Check still available (someone else may have claimed it)
                if food.status != 'available':
                    response = "END Sorry, this food was just claimed by someone else."
                elif food.posted_by == user:
                    response = "END You cannot claim your own listing."
                else:
                    # Create the claim
                    claim = Claim.objects.create(
                        food=food,
                        claimer=user
                    )
                    food.status = 'claimed'
                    food.save()

                    response = f"END ✅ Claimed!\n"
                    response += f"{food.food_type} claimed.\n"
                    response += f"Pickup: {food.pickup_address}\n"
                    response += f"Code: {claim.pickup_code}\n"
                    response += "Show code to donor to release food."
            else:
                response = "END Invalid selection."
        except (ValueError, IndexError):
            response = "END Something went wrong. Try again."

    # ── CONFIRM CLAIM BY ID ──
    elif user_input[0] == "3" and depth == 3 and user_input[2] == "1":
        try:
            food_id = int(user_input[1])
            food = Food.objects.get(id=food_id, status='available')

            # Prevent claiming own food
            if food.posted_by == user:
                response = "END You cannot claim your own food listing."
            else:
                claim = Claim.objects.create(
                    food=food,
                    claimer=user
                )
                food.status = 'claimed'
                food.save()

                response = f"END ✅ Claimed!\n"
                response += f"Food: {food.food_type}\n"
                response += f"Pickup: {food.pickup_address}\n"
                response += f"Your code: {claim.pickup_code}\n"
                response += "Show this code to the donor."

        except Food.DoesNotExist:
            response = "END Food not found or already claimed."
        except ValueError:
            response = "END Invalid ID."

    else:
        response = "END Session ended.\nDial again for menu."

    return HttpResponse(response, content_type='text/plain')
