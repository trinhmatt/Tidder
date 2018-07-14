const express = require('express'),
      router = express.Router();

import User from '../../models/user'
import Sub from '../../models/subreddit'
import Post from '../../models/post'
import Comment from '../../models/comment'

//Create post
//Needs to be before the fetch post to work
router.post('/t/:sub/create', (req, res) => {
  const absolutePath = req.protocol + '://' + req.get('host');
  let post = req.body;
  const id = req.body.sub;

  Sub.findById(id, (err, foundSub) => {
    //Set sub to the found sub for correct association in DB
    post.sub = foundSub._id
    if (err) {
      res.status(500).send(err)
    } else {
      Post.create(post, (err, newPost) => {
        if (err) {
          res.status(500).send(err)
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

//Edit posts
router.put('/t/:sub/:postID/edit', (req, res) => {
  const update = req.body;

  Post.findByIdAndUpdate(req.params.postID, update, (err) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send('Success')
    }
  })
})

//Save posts
router.put('/:userID/:postID/savepost', (req, res) => {

  User.findById(req.params.userID, (err, foundUser) => {
    if (err) {
      res.status(500).send('Could not find user')
    } else {
      foundUser.savedPosts.push(req.params.postID)
      foundUser.save()
      res.send('Success')
    }
  })
})

//Unsave posts
router.put('/:userID/:postID/unsavepost', (req, res) => {

  User.findById(req.params.userID, (err, foundUser) => {
    if (err) {
      res.status(500).send('Could not find user')
    } else {

      for (let i=0; i<foundUser.savedPosts.length; i++) {
        if (foundUser.savedPosts[i].toString().indexOf(req.params.postID) > -1) {
          foundUser.savedPosts.splice(i, 1)
          break
        }
      }

      foundUser.save()
      res.send('Success')
    }
  })
})

router.delete('/t/:sub/:postID/delete', (req, res) => {
  Post.findByIdAndRemove(req.body.id, (err) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send('Post deleted')
    }
  })
})

//Send post information to the client if a user trys to go to the post page without using react-Router
  //I.e. if they enter the post url into the browser and directly access the post page
router.post('/t/:sub/:postID', (req, res) => {
  Sub.findOne({name: req.params.sub}, (err, foundSub) => {
    if (err) {
      res.status(404).send({message: 'Error occured', error: err})
    } else {
      Post.findOne({_id: req.params.postID}).populate('comments').exec( (err, post) => {
        if (err) {
          res.send('Oops! Something happened, please try again or check the URL')
        } else {
          const response = {
            post,
            blockedUsers: foundSub.blockedUsers,
            admin: foundSub.admin.toString(),
            mods: foundSub.mods
          };

          res.send(response)
        }
      })
    }
  })
})

//To vote on a post
router.post('/:postID/vote', (req, res) => {
  Post.findOne({_id: req.params.postID}, (err, post) => {
    if (err) {
      res.status(500).send(err)
    } else {
      //Need to find user to save vote, prevent users from voting more than once
      User.findById(req.body.user, (err, foundUser) => {
        if (err) {
          res.status(500).send(err)
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

module.exports = router;
