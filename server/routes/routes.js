const express = require('express');
const router = express.Router();
const passport = require('passport');

import User from '../../models/user'

router.get('*', (req, res) => {
  res.render('index')
});

router.post('/register', (req, res) => {
  const username = new User({username:req.body.username}),
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

//Cannot use redirect here, all routes are handled on the client
router.post('/login', passport.authenticate('local'), (req, res) => {
  const user = {
    username: req.user.username,
    id: req.user._id
  }

  res.send(user)
});

module.exports = router;
