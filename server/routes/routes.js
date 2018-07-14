const express = require('express');
const router = express.Router();
const passport = require('passport');

import User from '../../models/user'
import Sub from '../../models/subreddit'
import Post from '../../models/post'
import Comment from '../../models/comment'

//Easier for all GET routes to be in this file since I can put them all before the catch all route (*)

//LOGOUT
//MUST BE PLACED BEFORE THE CURRENT USER CHECK OR ELSE LOGOUT WILL NOT PERSIST ON PAGE REFRESH
router.get('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.send('Logout succesful')
});

//Fetch default subreddits for homepage
  //THIS CANNOT BE MOVED TO THE SUBREDDIT ROUTES FILE, I DONT KNOW WHY BUT IT DOESNT WORK THERE...
  //Probably because its a get route and it must be placed before the catch all route (get/*)
router.get('/defaultsubs', (req, res) => {
  Sub.find({ isDefault: true }).populate('posts').exec( (err, foundSubs) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send(foundSubs)
    }
  })
})

// To get the currentUser data from backend
// All GET routes must be declared before the catch all to ensure they get priority
router.get('/currentuser', (req, res) => {
  if (!req.user) {
    res.send(null)
  } else {
    //To populate the subs array with the subscribed subreddits
    User.findById(req.user._id).populate({
      path: 'subs',
      select: 'name posts',
      populate: { path: 'posts' }}
    ).exec( (err, foundUser) => {
      if (!err) {
        res.send(foundUser)
      } else {
        console.log(err)
      }
    })
  }
})

router.get('/:username/profiledata', (req, res) => {
  User.find({username: req.params.username}).populate('savedPosts').exec( (err, foundSavedPosts) => {
    let errObj = {};

    if (err || foundSavedPosts.length === 0) {
      errObj.collection = 'SavedPosts'
      errObj.message = 'Could not find user'
      res.send(errObj)
    } else {
      Comment.find({author: req.params.username}).populate('post').exec( (err, foundComments) => {
        let response = {};

        if (err) {
          errObj.collection = 'Comment'
          errObj.message = err
          res.send(errObj)
        } else {
          Post.find({author: req.params.username}, (err, foundPosts) => {
            if (err) {
              errObj.collection = 'Post'
              errObj.message = err
              res.send(errObj)
            } else {
              response.comments = foundComments
              response.posts = foundPosts
              res.send(response)
            }
          })
        }
      })
    }
  })
})

router.get('/:username/saved', (req, res) => {
  User.find({ username: req.params.username}).populate('savedPosts').exec( (err, foundPosts) => {
    if (err) {
      res.send(err)
    } else {
      res.send(foundPosts)
    }
  })
})

//Search route
router.post('/api/search', (req, res) => {
  //search for any subs that have the query string as a substring
  Sub.find({name: {$regex: req.body.searchQuery, $options: "i"} }).exec( (err, foundSubs) => {
    if (err) {
      res.status(500).send('An error occurred');
    } else {
      let queryResults = {subs: foundSubs};

      Post.find({title: {$regex: req.body.searchQuery, $options: "i"} }).exec( (err, foundPosts) => {
        if (err) {
          res.status(500).send('An error occurred')
        } else {
          queryResults.posts = foundPosts;

          res.send(queryResults);
        }
      })
    }
  })
})

//Create user
router.post('/register', (req, res) => {
  const absolutePath = req.protocol + '://' + req.get('host');

  //Find all the default subs and add them to the users subscription list
  Sub.find({ isDefault: true }, (err, foundSubs) => {
    if (err) {
      console.log(err)
    } else {
      let subs = [];

      for (let i = 0; i<foundSubs.length; i++) {
        subs.push(foundSubs[i]._id)
      }

      const username = new User({ username: req.body.username, subs, votedPosts: [] }),
            password = req.body.password;

      User.register(username, password, (err, user) => {
        if (err){
          console.log(err)
        }
        passport.authenticate('local')(req, res, () => {
          res.render('index', {absolutePath})
        })
      })
    }
  })

})


//Login
//Cannot use redirect here, all routes are handled on the client
router.post('/login', passport.authenticate('local'), (req, res) => {
  //To populate the subs array with the subscribed subreddits
  User.findById(req.user._id).populate({
    path: 'subs',
    select: 'name posts',
    populate: { path: 'posts' }}
  ).exec( (err, foundUser) => {
    if (!err) {
      res.send(foundUser)
    } else {
      console.log(err)
    }
  })
});

router.get('*', (req, res) => {
  //So that index can always find bundle.js in dev or prod
  //Required to get nested paths working (i.e. url/t/path)
  //Required in every route that renders index
  const absolutePath = req.protocol + '://' + req.get('host');
  res.render('index', {absolutePath});
});



module.exports = router;
