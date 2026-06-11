import cloudinary.uploader

def upload_verification_document(file, folder):
    result = cloudinary.uploader.upload(
        file,
        folder=f"verification/{folder}",
        resource_type="auto",  # handles PDF and images
        access_mode="authenticated"  # private — not public ✅
    )
    return result['secure_url']