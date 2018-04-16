const express = require('express');
const router = express.Router();
const passport = require('passport');

import User from '../../models/user'
import Sub from '../../models/subreddit'
import Post from '../../models/post'
import Comment from '../../models/comment'

// To get the currentUser data from backend
// All GET routes must be declared before the catch all to ensure they get priority
router.get('/currentuser', (req, res) => {
  if (!req.user) {
    res.send(null)
  } else {
    //To populate the subs array with the subscribed subreddits
    User.findById(req.user._id).populate('subs', 'posts name').exec( (err, foundUser) => {
      if (!err) {
        res.send(foundUser)
      } else {
        console.log(err)
      }
    })
  }
})

//To send the sub information to the client
//Made it a post so that you can directly go to a sub home without navigating from the main page
router.post('/t/:sub', (req, res) => {
  Sub.findOne({name: req.params.sub}).populate('posts').exec( (err, sub) => {
    if (!err) {
      res.send(sub)
    } else {
      console.log(err)
    }
  })
})

//Send post information to the client if a user trys to go to the post page without using react-Router
  //I.e. if they enter the post url into the browser and directly access the post page
router.post('/t/:sub/:postID', (req, res) => {
  Post.findOne({_id: req.params.postID}, (err, post) => {
    if (err) {
      res.send('Oops! Something happened, please try again or check the URL')
    } else {
      res.send(post)
    }
  })
})

//To subscribe to a sub
router.post('/subscribe/:id', (req, res) => {
  const absolutePath = req.protocol + '://' + req.get('host') + '/bundle.js'
  const sub = req.body;

  User.findById(req.params.id, (err, foundUser) => {
    if (!err) {
      foundUser.subs.push(sub)
      foundUser.save()
      res.render('index', {absolutePath})
    }
  })
})


router.get('*', (req, res) => {
  //So that index can always find bundle.js in dev or prod
  //Required to get nested paths working (i.e. url/t/path)
  //Required in every route that renders index
  const absolutePath = req.protocol + '://' + req.get('host') + '/bundle.js'
  res.render('index', {absolutePath});
});


//Create user
router.post('/register', (req, res) => {
  const absolutePath = req.protocol + '://' + req.get('host') + '/bundle.js'
  const username = new User({username: req.body.username, subs: []}),
        password = req.body.password;
  User.register(username, password, (err, user) => {
    if (err){
      console.log(err)
    }
    passport.authenticate('local')(req, res, () => {
      res.render('index', {absolutePath})
    })
  })
})

//Create subreddit
router.post('/createsubtidder', (req, res) => {
  const absolutePath = req.protocol + '://' + req.get('host') + '/bundle.js'
  let sub = req.body;
  const id = req.body.admin;
  User.findById(id, (err, foundUser) => {
    if (!err) {
      //Set admin to foundUser for correct association
      sub.admin = foundUser
      Sub.create(sub, (err, newSub) => {
        if (err) {

          if (err.errmsg.indexOf('dup') > -1) {
            const errorMessage = 'Error: A subtidder of that name already exists, please try again.'
            res.send(errorMessage)
          }

        } else {
          foundUser.subs.push(newSub)
          foundUser.save()
          res.render('index', {absolutePath})
        }
      })
    } else {
      console.log(err)
    }
  })
})

//Create post
router.post('/t/:sub/create', (req, res) => {
  const absolutePath = req.protocol + '://' + req.get('host') + '/bundle.js';
  let post = req.body;
  const id = req.body.sub;

  Sub.findById(id, (err, foundSub) => {
    //Set sub to the found sub for correct association in DB
    post.sub = foundSub
    if (err) {
      console.log(err.errmsg)
    } else {
      Post.create(post, (err, newPost) => {
        if (err) {
          console.log(err.errmsg)
        } else {
          foundSub.posts.push(newPost)
          foundSub.save()
          res.render('index', {absolutePath})
        }
      })
    }
  })
})

//Create comment
router.post('/t/:sub/:postID/comment', (req, res) => {
  const absolutePath = req.protocol + '://' + req.get('host') + '/bundle.js';
  let comment = req.body;
  const postID = req.params.postID;

  Post.findById(postID, (err, foundPost) => {
    comment.post = foundPost
    if (err) {
      console.log(err.errmsg)
    } else {
      Comment.create(comment, (err, newComment) => {
        if (err) {
          console.log(err.errmsg)
        } else {
          foundPost.comments.push(newComment)
          foundPost.save()
          res.render('index', {absolutePath})
        }
      })
    }
  })
})

//Login
//Cannot use redirect here, all routes are handled on the client
router.post('/login', passport.authenticate('local'), (req, res) => {
  //To populate the subs array with the subscribed subreddits
  User.findById(req.user._id).populate('subs', 'posts name').exec( (err, foundUser) => {
    if (!err) {
      res.send(foundUser)
    } else {
      console.log(err)
    }
  })
});


module.exports = router;
