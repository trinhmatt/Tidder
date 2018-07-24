const express = require('express'),
      router = express.Router();

import User from '../../models/user'
import Sub from '../../models/subreddit'
import Post from '../../models/post'
import Comment from '../../models/comment'


//Create comment
router.post('/api/t/:sub/:postID/comment', (req, res) => {
  let comment = req.body;
  const postID = req.params.postID;

  Post.findById(postID, (err, foundPost) => {
    if (err) {
      res.status(500).send(err)
    } else {
      comment.post = foundPost;

      Comment.create(comment, (err, newComment) => {
        if (err) {
          res.status(500).send(err)
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

//Edit
router.put('/t/:sub/:postID/editcomment', (req, res) => {
  const update = req.body;

  Comment.findByIdAndUpdate(req.body._id, update, (err) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send('Success')
    }
  })
})

//Delete
router.delete('/t/:sub/:postID/comment/delete', (req, res) => {
  Comment.findByIdAndRemove(req.body.id, (err) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send('Post deleted')
    }
  })
})

router.post('/:commentID/reply', (req, res) => {
  Comment.findOne({_id: req.params.commentID}, (err, foundComment) => {
    if (err) {
      res.status(404).send('Could not find original comment')
    } else {
      Comment.create(req.body.reply, (err, newReply) => {
        if (err) {
          res.status(500).send('Could not create new comment')
        } else {
          foundComment.replies.push(newReply)
          foundComment.save()
          res.send('Success')
        }
      })
    }
  })
})

//To vote on a comment
router.post('/:postID/vote', (req, res) => {
  Comment.findOne({_id: req.body.comment}, (err, comment) => {
    if (err) {
      res.status(500).send(err)
    } else {
      //Need to find user to save vote, prevent users from voting more than once
      User.findById(req.body.user, (err, foundUser) => {
        if (err) {
          res.status(500).send(err)
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

module.exports = router;
