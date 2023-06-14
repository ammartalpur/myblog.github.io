//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose')
const _ = require('lodash')


const homeStartingContent = "At Daily Journal, we strive to provide you with a diverse range of engaging and thought-provoking content. Our blog covers a wide array of topics, including technology, science, lifestyle, current events, and more. We aim to keep you informed, entertained, and inspired with our daily articles.";
const aboutContent =
  `Welcome to Daily Journal!

At Daily Journal, we strive to provide you with a diverse range of engaging and thought - provoking content.Our blog covers a wide array of topics, including technology, science, lifestyle, current events, and more.We aim to keep you informed, entertained, and inspired with our daily articles.

Here are some of the exciting content you can expect from Daily Journal:

Tech and Innovation: Stay up - to - date with the latest advancements in technology, including artificial intelligence, blockchain, virtual reality, and emerging trends that are shaping our digital future.

Science and Discoveries: Delve into the fascinating world of scientific research, breakthroughs, and discoveries across various disciplines, such as space exploration, medicine, environmental science, and beyond.

Lifestyle and Wellness: Explore articles on health, fitness, nutrition, mindfulness, and self - improvement.Discover tips, tricks, and inspiration for leading a balanced and fulfilling lifestyle.

Current Events and Commentary: Get insights and analysis on important global events, social issues, and cultural trends.Engage in thought - provoking discussions and gain a deeper understanding of the world around us.

Travel and Adventure: Embark on virtual journeys through our travel articles, uncovering hidden gems, exploring diverse cultures, and gathering tips for planning your own adventures.

Book and Movie Reviews: Dive into our reviews of the latest literary releases and cinematic masterpieces.Discover captivating stories and gain recommendations for your next reading or movie - watching session.

Personal Stories and Inspirational Interviews: Read inspiring personal stories and interviews with individuals who have made a difference, overcome challenges, or are leading innovative initiatives in their respective fields.

We are committed to providing you with high - quality content that sparks curiosity, promotes critical thinking, and encourages meaningful conversations.So, bookmark Daily Journal and join us on this exciting journey of exploration and enlightenment.

Remember to check back daily for fresh articles, and feel free to engage with our content by leaving comments and sharing your thoughts.Stay curious, stay informed, and let Daily Journal be your daily dose of inspiration!`;
const contactContent = "You can content the Developer of this company: knowtalpur@gmail.com";

const app = express();
const posts = []
const port = process.env.PORT || 3000

mongoose.connect('mongodb+srv://ammar:QcTOSFzo5GXmXO8C@ammar.z1dmemi.mongodb.net/blogDB?retryWrites=true&w=majority')
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
    // console.log(post);
    res.render('home', { startingContent: homeStartingContent, posts: post })
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
  Post.find().then((posts) => {
    posts.forEach((posts) => {
      let storedTitle = _.lowerCase(posts.title)
      if (requestedTitle == storedTitle) {
        // console.log(pots.contect);
        res.render('postpage', { title: posts.title, post: posts.content })
      } else {
        console.log("Not a match");
      }
    })
  }).catch((err) => {
    console.log("failed to get post from database");
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

