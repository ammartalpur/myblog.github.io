//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose')
const _ = require('lodash')


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const posts = []
const port = process.env.PORT || 3000

mongoose.connect('mongodb://localhost:27017/blogDB')
const db = mongoose.connection;

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Post = mongoose.model("Post", postSchema)

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get('/', (req, res) => {
  Post.find().then((post) => {
    console.log(post.content);
    // res.render('home', { startingContent: homeStartingContent, posts: post })
  }).catch((err) => {
    console.log("Failed to get post from database");
  })

})
app.get('/about', (req, res) => {
  res.render('about', { startingContent: aboutContent })
})
app.get('/contact', (req, res) => {
  res.render('contact', { startingContent: contactContent })

})
app.get("/compose", (req, res) => {
  res.render('compose')

});

app.get('/posts/:title', (req, res) => {
  let requestedTitle = _.lowerCase(req.params.title);
  posts.forEach((posts) => {
    let storedTitle = _.lowerCase(posts.title)
    if (requestedTitle == storedTitle) {
      res.render('postpage', { title: posts.title, post: posts.body })
    } else {
      console.log("Not a match");
    }
  })

})

app.post('/compose', (req, res) => {
  const newPost = {
    title: req.body.postTitle,
    body: req.body.postBody
  }
  if (!newPost.body || !newPost.title) {
    res.redirect('/compose')
  } else {
    const pushNewPost = new Post({
      title: newPost.title,
      content: newPost.body
    })
    pushNewPost.save().then(
      function () {
        res.redirect('/')
        console.log("New post pushed to database");
      }
    ).catch(
      function (err) {
        res.redirect('/compose')
        console.log("failed to push post to database");
      }
    )
  }
})



db.on('error', console.error.bind(console, 'Server is failed to connect to database'))
db.on('open', function () {
  console.log("Server is connected to database");
  app.listen(port, console.log(`Server is running on port ${port}`));
})

