const axios = require('axios');
const { optimizeCloudinaryUrl } = require('./utils/urlHelper');

// Example Cloudinary URL (replace with a real one if possible, or use a generic one)
// Using a placeholder that looks like a Cloudinary URL to test the string manipulation
const testUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';

const optimizedUrl = optimizeCloudinaryUrl(testUrl);
console.log('Original URL:', testUrl);
console.log('Optimized URL:', optimizedUrl);

if (optimizedUrl === testUrl) {
    console.log('Optimization failed: URL was not changed.');
} else if (optimizedUrl.includes('f_auto,q_auto')) {
    console.log('Optimization success: URL contains f_auto,q_auto.');
    
    // Now let's try to fetch it and check headers (using the demo URL which should work)
    axios.head(optimizedUrl, {
        headers: { 'Accept': 'image/avif' }
    })
        .then(response => {
            console.log('Content-Type with Accept: image/avif:', response.headers['content-type']);
            if (response.headers['content-type'] === 'image/avif') {
                console.log('Verified: Server returns image/avif when requested.');
            } else {
                console.log('Note: Server returned', response.headers['content-type']);
            }
        })
        .catch(err => {
            console.error('Error fetching URL:', err.message);
        });

} else {
    console.log('Optimization failed: Unexpected result.');
}
