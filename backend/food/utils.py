from math import radians, sin, cos, sqrt, atan2

def calculate_distance(lat1, lon1, lat2, lon2):

    try:

        lat1 = float(lat1)
        lon1 = float(lon1)
        lat2 = float(lat2)
        lon2 = float(lon2)

        R = 6371  # Earth radius in kilometres

        # Convert degrees to radians
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

        # Difference between points
        dlat = lat2 - lat1
        dlon = lon2 - lon1

        # Haversine formula
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))

        return round(R * c, 1)  # returns distance e.g. 2.3
    except (TypeError, ValueError) as e:
        print(f"Error calculating distance: {e}")
        return None  # return None if coordinates are invalid

