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

//To send the sub information to the client
//Made it a post so that you can directly go to a sub home without navigating from the main page
router.post('/t/:sub', (req, res) => {
  Sub.findOne({name: req.params.sub}, (err, sub) => {
    if (!err) {
      res.send(sub)
    } else {
      console.log(err)
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
      sub.admin = foundUser
      Sub.create(sub, (err, newSub) => {
        if (err) {
          console.log(err.errmsg)
          // this example is showing how to get the field `email` out of the err message
          let field = err.message.split('index: tidder.')[1].split('.$')[1]
          // now we have `email_1 dup key`
          field = field.split(' dup key')[0]
          field = field.substring(0, field.lastIndexOf('_')) // returns email
          console.log(field)
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
