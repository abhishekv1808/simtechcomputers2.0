self.addEventListener('push', function (event) {
    const data = event.data.json();
    console.log('Push received:', data);

    const options = {
        body: data.body,
        icon: data.icon || '/images/logo.png',
        image: data.image, // Large banner image
        badge: '/images/logo.png',
        data: {
            url: data.url || '/'
        },
        actions: data.actions || [] // Action buttons
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    let urlToOpen = event.notification.data.url;

    // Check if an action button was clicked
    if (event.action) {
        // The action ID is the URL itself in our implementation
        urlToOpen = event.action;
    }

    event.waitUntil(
        clients.openWindow(urlToOpen)
    );
});
