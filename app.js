//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { redirect } = require("express/lib/response");
const _ = require("lodash");
const mongoose = require("mongoose")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const posts = [];

mongoose.connect("mongodb://localhost:27017/blog-post", (err)=>{
  if(!err) {
    console.log("Database connected Successfully!");
  }
})

const composeSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter the Post title."]
  },
  content:{
    type: String
  }
})

const Compose = mongoose.model("compose", composeSchema)

app.get("/", (req, res)=>{

  Compose.find({}, (err, foundList)=>{

        res.render("home", {
          startingContent: homeStartingContent, 
          posts: foundList 
        })
      
    })
})



app.get("/about", (req, res)=>{
  res.render("about", {startingContent: aboutContent})
})

app.get("/contact", (req, res)=>{
  res.render("contact", {startingContent: contactContent})
})

app.get("/compose", (req, res)=>{
  res.render("compose")
})

app.get("/posts/:_postId", (req, res)=>{
  const requestedPostId  = req.params._postId

  Compose.findOne({_id: requestedPostId}, (err, foundPost)=>{
    if(!err) {
      res.render("post", {title: foundPost.title, content: foundPost.content})
    }
  })

})

app.post("/compose", (req, res)=>{

  const newCompose = new Compose({
    title: req.body.postTitle,
    content: req.body.postBody
  })

  newCompose.save((err)=>{
    if(!err) {
      console.log("Successfully Inserted!");
      res.redirect("/")
    }
  })

})









app.listen(3000, function() {
  console.log("Server started on port 3000");
});
