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

router.post('/login', passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login'
}), (req, res) => {
  console.log(req.user)
  res.send('eyoooooo')
});

module.exports = router;
