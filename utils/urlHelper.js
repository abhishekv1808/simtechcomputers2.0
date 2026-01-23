const optimizeCloudinaryUrl = (url) => {
    if (!url || typeof url !== 'string') {
        return '/images/default-product.png'; // Return default if no URL
    }

    // Check if it's a Cloudinary URL
    if (url.includes('cloudinary.com')) {
        // Check if already optimized (prevent double injection)
        if (url.includes('/f_auto,q_auto/')) {
            return url;
        }

        // Inject optimization parameters after /upload/
        return url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    return url; // Return original if not Cloudinary
};

module.exports = { optimizeCloudinaryUrl };
