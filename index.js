const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Post = require("./models/post.js");
const methodOverride = require("method-override");
const expressError = require("./expressError");
const ejsMate = require("ejs-mate");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

// MONGOOSE INITIALISATION
main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb+srv://singhnitin2050:UE0p1gQ8fQxbICCx@clusterquoraclone.eswixko.mongodb.net/?retryWrites=true&w=majority&appName=ClusterQuoraClone");
}

// WRAPSYNC FUNCTION
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

// INDEX ROUTE
app.get("/", wrapAsync(async (req, res, next) => {
    let allPosts = await Post.find();
    res.render("index.ejs", { allPosts });
  })
);

// NEW ROUTE
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

// POST ROUTE
app.post("/posts", wrapAsync(async (req, res, next) => {
    let { creator, question, answer } = req.body;
    const newPost = new Post({
      creator: creator,
      question: question,
      answer:answer,
      created_at: new Date(),
    });
    newPost.save();

    res.redirect("/");
  })
);

// VIEW ROUTE
app.get("/posts/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let post = await Post.findById(id);
    if (!post) {
      next(new expressError(404, "Not Found"));
    }
    res.render("view.ejs", { post });
  }));

// EDIT ROUTE
app.get("/posts/:id/edit", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let post = await Post.findById(id);
    res.render("edit.ejs", { post });
  })
);

// UPDATE ROUTE
app.put("/posts/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let { answer: answer } = req.body;
    let updated_at = new Date();
    let newPost = await Post.findByIdAndUpdate(id,{answer: answer, updated_at: updated_at }, { runValidators: true, new: true });
    res.redirect("/");
  })
);

// DESTROY ROUTE
app.delete("/posts/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletedPost = await Post.findByIdAndDelete(id);
    res.redirect("/");
  })
);

// ABOUT US ROUTE
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  let { status = 500, message = "Some error occured" } = err;
  res.status(status).render("error.ejs", {message});
});

// PORT
app.listen(8000, () => {
  console.log("server runnig successfully at port 8000");
});
