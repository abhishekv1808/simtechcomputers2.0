const mongoose = require('mongoose');
const DailyStats = require('./models/dailyStats');

const MONGODB_URI = "mongodb+srv://abhishekv1808:Grow%40%24%402025@aribnb.xvmlcnz.mongodb.net/simtech20?retryWrites=true&w=majority&appName=aribnb";

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        const today = new Date();
        const stats = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateString = d.toISOString().split('T')[0];

            stats.push({
                date: dateString,
                views: Math.floor(Math.random() * 50) + 10, // Random views 10-60
                sales: Math.floor(Math.random() * 5) // Random sales 0-5
            });
        }

        for (const stat of stats) {
            await DailyStats.findOneAndUpdate(
                { date: stat.date },
                stat,
                { upsert: true, new: true }
            );
            console.log(`Seeded stats for ${stat.date}`);
        }

        console.log('Seeding complete!');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
