const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    creator: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    }, 
    answer: {
        type: String,
        maxLength: 1000,
    },
    created_at: {
        type: Date,
        required: true,
    },
    updated_at: {
        type: Date,
    },
})

const Post  = mongoose.model("Post", postSchema);

module.exports = Post;  