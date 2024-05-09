const mongoose = require("mongoose");
const Post = require("./models/post.js");

main()
.then(() => {
   console.log("connection successful");
})
.catch((err) => {
   console.log(err)
});

async function main() {
 await mongoose.connect('mongodb://127.0.0.1:27017/quora');
}

let allPosts = [
    {
        creator: "Rohan",
        question: "Ramsay",
        answer: "I want to stay alone",
        created_at: new Date(),
    },
    {
        creator:"Priya",
        question:"Sita",
        answer:"Hello Sita",
        created_at:new Date(),

    },

]

Post.insertMany(allPosts)
.then((res) => {
   console.log(res);
})
.catch((err) => {
   console.log(err);
})