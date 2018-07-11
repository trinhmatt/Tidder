const express = require('express');
const router = express.Router();
const passport = require('passport');

import User from '../../models/user'
import Sub from '../../models/subreddit'
import Post from '../../models/post'
import Comment from '../../models/comment'

//LOGOUT
//MUST BE PLACED BEFORE THE CURRENT USER CHECK OR ELSE LOGOUT WILL NOT PERSIST ON PAGE REFRESH
router.get('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.send('Logout succesful')
});

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

router.get('/defaultsubs', (req, res) => {
  Sub.find({ isDefault: true }).populate('posts').exec( (err, foundSubs) => {
    if (err) {
      console.log(err)
    } else {
      res.send(foundSubs)
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

router.put('/t/:sub/:postID/editcomment', (req, res) => {
  const update = req.body;

  Comment.findByIdAndUpdate(req.body._id, update, (err) => {
    if (err) {
      console.log(err.errmsg)
    } else {
      res.send('Success')
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
  const absolutePath = req.protocol + '://' + req.get('host');
  let post = req.body;
  const id = req.body.sub;

  Sub.findById(id, (err, foundSub) => {
    //Set sub to the found sub for correct association in DB
    post.sub = foundSub._id
    if (err) {
      console.log(err)
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

//Edit posts
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

//Save posts
router.put('/:userID/:postID/savepost', (req, res) => {

  User.findById(req.params.userID, (err, foundUser) => {
    if (err) {
      res.send('Could not find user')
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
      res.send('Could not find user')
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
