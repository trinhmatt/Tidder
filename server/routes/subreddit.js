const express = require('express'),
      router = express.Router();

import User from '../../models/user'
import Sub from '../../models/subreddit'
import Post from '../../models/post'
import Comment from '../../models/comment'



//To send the sub information to the client
//Made it a post so that you can directly go to a sub home without navigating from the main page
router.post('/t/:sub', (req, res) => {
  Sub.findOne({name: req.params.sub}).populate('posts').exec( (err, sub) => {
    if (!err) {
      //need to store sub data in a new object because I dont want to add isSubbed into the database object
      let subData = {sub: sub};

      //Check if user is subbed to sub
      //Cant do this client side because the state is not available to lifecycle methods on initialization
      if (req.user) {

        for (let i = 0; i<req.user.subs.length; i++) {
          if (req.user.subs[i].toString() === sub._id.toString()) {
            subData.isSubbed = true
            break
          }
        }
        res.send(subData)
      } else {
        res.send(subData)
      }
    } else {
      res.send(null)
    }
  })
})

//To subscribe to a sub
router.post('/subscribe/:id', (req, res) => {
  const absolutePath = req.protocol + '://' + req.get('host');
  const sub = req.body;

  User.findById(req.params.id, (err, foundUser) => {
    if (!err) {
      foundUser.subs.push(sub)
      foundUser.save()
      res.render('index', {absolutePath})
    }
  })
})

//Create subreddit
router.post('/createsubtidder', (req, res) => {
  const absolutePath = req.protocol + '://' + req.get('host');
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

          const newSubId = { _id: newSub._id }

          foundUser.subs.push(newSubId)
          foundUser.save()
          res.render('index', {absolutePath})
        }
      })
    } else {
      console.log(err)
    }
  })
})

router.post('/:subID/addmod', (req, res) => {
  //Need to check if the user exists
  User.find({username: req.body.newMod}, (err, foundUser) => {
    //Mongo does not throw an error if the user was not found
    if (foundUser.length === 0 || err) {
      res.status(404).send({message: 'User not found'})
    } else {
      Sub.findById(req.params.subID, (err, foundSub) => {
        if (err) {
          res.send(err)
        } else {
          foundSub.mods.push(req.body.newMod)
          foundSub.save()
          res.send(foundSub)
        }
      })
    }
  })
})

router.delete('/:subID/deletemod', (req, res) => {
  Sub.findById(req.params.subID, (err, foundSub) => {
    if (!foundSub._id || err) {
      res.status(404).send({message: 'The sub was not found, please try again'})
    } else {

      for (let i = 0; i<foundSub.mods.length; i++) {
        if (foundSub.mods[i] === req.body.modToDelete) {
          foundSub.mods.splice(i, 1)
          break
        }
      }

      foundSub.save()
      res.send(foundSub)
    }

  })
})

router.post('/:subID/blockuser', (req, res) => {
  User.find({username: req.body.blockedUser}, (err, foundUser) => {
    if (foundUser.length === 0 || err) {
      res.status(404).send('User not found')
    } else {

      Sub.findById(req.params.subID, (err, foundSub) => {
        if (!foundSub._id || err) {
          res.status(404).send('Sub not found')
        } else {
          let isUserMod = false;

          for (let i = 0; i<foundSub.mods.length; i++) {
            if (foundSub.mods[i] === foundUser[0].username) {
              isUserMod = true;
              break;
            }
          }

          if (isUserMod) {
            res.status(500).send(
              'Mods cannot be banned, please remove the user as a mod before attempting to ban them again'
            )
          } else {
            foundSub.blockedUsers[foundUser[0]._id] = true
            foundSub.markModified('blockedUsers')
            foundSub.save()
            res.send(foundSub)
          }
        }
      })
    }
  })
})

router.post('/:subID/unblockuser', (req, res) => {
  User.find({username: req.body.unblockedUser}, (err, foundUser) => {
    if (foundUser.length === 0 || err) {
      res.status(404).send({message: 'User not found'})
    } else {

      Sub.findById(req.params.subID, (err, foundSub) => {
        if (!foundSub._id || err) {
          res.status(404).send({message: 'Sub not found'})
        } else {
          delete foundSub.blockedUsers[foundUser[0]._id]
          foundSub.markModified('blockedUsers')
          foundSub.save()
          res.send(foundSub)
        }
      })
    }
  })
})

router.get('/:subID/allbanned', (req, res) => {
  Sub.findById(req.params.subID, (err, foundSub) => {
    if (!foundSub._id || err) {
      res.status(404).send({message: 'The sub was not found, please try again'})
    } else {

      let blockedUserNames = [];
      //Since the user search is asynchronous, I need to add a counter so that
        //the server doesnt send an empty array when the for loop technically finishes
      let keyCounter = 0;

      for (let i in foundSub.blockedUsers) {
        if (foundSub.blockedUsers[i]) {
          User.findById(i, (err, foundUser) => {
            if (foundUser._id && !err) {
              blockedUserNames.push(foundUser.username)
            }

            keyCounter += 1

            if (keyCounter === Object.keys(foundSub.blockedUsers).length) {
              res.send(blockedUserNames)
            }
          })
        }
      }
    }
  })
})

module.exports = router;
