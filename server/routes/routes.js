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

//Create comment
router.post('/api/t/:sub/:postID/comment', (req, res) => {
  let comment = req.body;
  const postID = req.params.postID;

  Post.findById(postID, (err, foundPost) => {
    if (err) {
      console.log(err.errmsg)
    } else {
      comment.post = foundPost;

      Comment.create(comment, (err, newComment) => {
        if (err) {
          console.log(err.errmsg)
        } else {
          //NTS: YOU SHOULD NOT PUSH THE ENTIRE OBJECT, ALL YOU NEED IS THE ID
          const commentRef = { _id: newComment._id }

          foundPost.comments.push(commentRef)
          foundPost.save()
          res.send(newComment)
        }
      })
    }
  })
})

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
      console.log(err)
    }
  })
})

//Create post
//Needs to be before the fetch post to work
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
          const newPostId = { _id: newPost._id }

          foundSub.posts.push(newPostId)
          foundSub.save()
          res.render('index', {absolutePath})
        }
      })
    }
  })
})

router.put('/t/:sub/:postID/edit', (req, res) => {
  const update = req.body;

  Post.findByIdAndUpdate(req.params.postID, update, (err) => {
    if (err) {
      console.log(err.errmsg)
    } else {
      res.send('Success')
    }
  })
})

router.delete('/t/:sub/:postID/delete', (req, res) => {
  Post.findByIdAndRemove(req.body.id, (err) => {
    if (err) {
      console.log(err.errmsg)
    } else {
      res.send('Post deleted')
    }
  })
})

router.delete('/t/:sub/:postID/comment/delete', (req, res) => {
  Comment.findByIdAndRemove(req.body.id, (err) => {
    if (err) {
      console.log(err.errmsg)
    } else {
      res.send('Post deleted')
    }
  })
})

//Send post information to the client if a user trys to go to the post page without using react-Router
  //I.e. if they enter the post url into the browser and directly access the post page
router.post('/t/:sub/:postID', (req, res) => {
  Post.findOne({_id: req.params.postID}).populate('comments').exec( (err, post) => {
    if (err) {
      res.send('Oops! Something happened, please try again or check the URL')
    } else {
      res.send(post)
    }
  })
})

//To vote on a post
router.post('/t/:sub/:postID/vote', (req, res) => {
  Post.findOne({_id: req.params.postID}, (err, post) => {
    if (err) {
      console.log(err.errmsg)
      res.send('Error')
    } else {
      //Need to find user to save vote, prevent users from voting more than once
      User.findById(req.body.user, (err, foundUser) => {
        if (err) {
          console.log(err.errmsg)
          res.send('Error')
        } else {
          //Both variables needed in case the user has already voted on the post
          let voteReset = false;
          let voteSwitch = false;

          for (let i = 0; i<foundUser.votedPosts.length; i++) {
            //If the user has already voted and the new vote is the same as the old
            if (foundUser.votedPosts[i].post === req.params.postID) {
              if (foundUser.votedPosts[i].vote === req.body.vote) {
                voteReset = true;
                foundUser.votedPosts.splice(i, 1)
                foundUser.save()
                break
              } else {
                voteSwitch = true;
                foundUser.votedPosts[i].vote = req.body.vote
                foundUser.save()
                break
              }
            }
          }

          if (voteReset) {

            if (req.body.vote === 1) {
              post.votes.up -= 1
            } else {
              post.votes.down += 1
            }

          } else if (voteSwitch) {
            //req.body.vote = 1 or -1, so adding either will be the same thing as a switch
            post.votes.up += req.body.vote
            post.votes.down += req.body.vote

          } else {
            //If voteSwitch and voteReset are false, the user has never voted
            if (req.body.vote === 1) {
              post.votes.up += 1
            } else {
              post.votes.down -= 1
            }

            const userVote = {post: req.params.postID, vote: req.body.vote}
            foundUser.votedPosts.push(userVote)
            foundUser.save()

          }

          post.save()
          res.send('success')

        }
      })
    }
  })
})

//To vote on a comment
router.post('/t/:sub/:postID/comment', (req, res) => {
  Comment.findOne({_id: req.body.comment}, (err, comment) => {
    if (err) {
      console.log(err.errmsg)
      res.send('Error')
    } else {
      //Need to find user to save vote, prevent users from voting more than once
      User.findById(req.body.user, (err, foundUser) => {
        if (err) {
          console.log(err.errmsg)
          res.send('Error')
        } else {
          //Both variables needed in case the user has already voted on the comment
          let voteReset = false;
          let voteSwitch = false;

          for (let i = 0; i<foundUser.votedPosts.length; i++) {
            //If the user has already voted and the new vote is the same as the old
            if (foundUser.votedPosts[i].post === req.body.comment) {
              if (foundUser.votedPosts[i].vote === req.body.vote) {
                voteReset = true;
                foundUser.votedPosts.splice(i, 1)
                foundUser.save()
                break
              } else {
                voteSwitch = true;
                foundUser.votedPosts[i].vote = req.body.vote
                foundUser.save()
                break
              }
            }
          }

          if (voteReset) {

            if (req.body.vote === 1) {
              comment.votes.up -= 1
            } else {
              comment.votes.down += 1
            }

          } else if (voteSwitch) {
            //req.body.vote = 1 or -1, so adding either will be the same thing as a switch
            comment.votes.up += req.body.vote
            comment.votes.down += req.body.vote

          } else {
            //If voteSwitch and voteReset are false, the user has never voted
            if (req.body.vote === 1) {
              comment.votes.up += 1
            } else {
              comment.votes.down -= 1
            }

            const userVote = {post: req.body.comment, vote: req.body.vote}
            foundUser.votedPosts.push(userVote)
            foundUser.save()

          }

          comment.save()
          res.send('success')

        }
      })
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
  const username = new User({ username: req.body.username, subs: [], votedPosts: [] }),
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
