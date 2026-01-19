const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    content: {
        type: String, // Can contain HTML
        required: true
    },
    image: {
        type: String, // URL to image
        required: true
    },
    author: {
        type: String,
        default: 'Simtech Team'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
