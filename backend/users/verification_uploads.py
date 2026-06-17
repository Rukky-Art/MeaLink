import cloudinary.uploader

def upload_verification_document(file, folder):

    result = cloudinary.uploader.upload(
        file,
        folder=f"verification/{folder}",
        resource_type="auto",  # handles PDF and images
        type="authenticated"  # private — not public ✅
    )
    print(result)
    return result['secure_url']