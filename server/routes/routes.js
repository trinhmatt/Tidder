const express = require('express');
const router = express.Router();
const passport = require('passport');

import User from '../../models/user'
import Sub from '../../models/subreddit'


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

router.get('/*', (req, res) => {
  res.render('index')
});

//Create user
router.post('/register', (req, res) => {
  const username = new User({username: req.body.username, subs: []}),
      password = req.body.password;
  User.register(username, password, (err, user) => {
    if (err){
      console.log(err)
    }
    passport.authenticate('local')(req, res, () => {
      res.render('index')
    })
  })
})

//Create subreddit
router.post('/createsubtidder', (req, res) => {
  const sub = req.body;

  Sub.create(sub, (err, newSub) => {
    if (err) {
      console.log(err)
    } else {
      //Subscribe the creator to the sub
      const id = sub.admin;

      User.findById(id, (err, foundUser) => {
        if (!err) {
          foundUser.subs.push(newSub)
          foundUser.save()
          res.render('index')
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
