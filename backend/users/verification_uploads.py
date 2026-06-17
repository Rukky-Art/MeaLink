import cloudinary.uploader
import logging

logger = logging.getLogger(__name__)

def upload_verification_document(file, folder):
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=f"verification/{folder}",
            resource_type="auto",
            type="authenticated"
        )
        logger.info(f"Cloudinary upload result: {result}")
        url = result.get('secure_url')
        if not url:
            logger.warning(f"No secure_url in Cloudinary result: {result}")
        return url
    except Exception as e:
        logger.exception(f"Cloudinary upload failed: {e}")
        return None