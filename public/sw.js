self.addEventListener('push', function (event) {
    const data = event.data.json();
    console.log('Push received:', data);

    const options = {
        body: data.body,
        icon: data.icon || '/images/logo.png', // Add a default logo path if specific icon not provided
        badge: '/images/logo.png',
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
