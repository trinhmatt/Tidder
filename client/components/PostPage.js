import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Modal from 'react-modal'
import moment from 'moment'
import Comment from './Comment'

class PostPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      comment: '',
      postData: '',
      allComments: [],
      isAuthor: false,
      isModalOpen: false,
      typeOfModal: null,
      commentID: null,
      blockedUsers: {}
    }
  }
  componentDidMount() {
    let allComments = [];
    let isAuthor = false;
    let isAdmin = false;
    let isMod = false;

    //If the user trys to access the page without going through the react router
    //I.e. directly entering the URL in the browser

    axios.post(`${this.props.location.pathname}`)
      .then( (response) => {
        //Need this to tell user when/how long ago the post/comment was submitted
        const currentMoment = moment();
        const postMoment = moment(response.data.post.dateCreated, 'MMMM Do YYYY, h:mm:ss a');
        const postMomentDiff = postMoment.from(currentMoment);

        for (let i = 0; i<response.data.post.comments.length; i++) {

          //Compare the submission date with the current date
          const commentMoment = moment(response.data.post.comments[i].dateCreated, 'MMMM Do YYYY, h:mm:ss a')
          const displayDifference = commentMoment.from(currentMoment)

          let replies = [];

          for (let x = 0; x<response.data.post.comments[i].replies.length; x++) {
            replies.push(
              <Comment
                key={response.data.post.comments[i].replies[x]._id}
                auth={this.props.auth}
                commentData={response.data.post.comments[i].replies[x]}
                displayDifference={displayDifference}
                location={this.props.location}
                history={this.props.history}
              />)
          }

          const commentDiv = (
            <Comment
              key={response.data.post.comments[i]._id}
              auth={this.props.auth}
              commentData={response.data.post.comments[i]}
              displayDifference={displayDifference}
              location={this.props.location}
              history={this.props.history}
              replies={replies}
            />
          )
          allComments.push(commentDiv)
        }



        if (response.data.post.author === this.props.auth.username) {
          isAuthor = true;
        }

        if (response.data.admin === this.props.auth.id) {
          isAdmin = true;
        }

        for (let n = 0; n<response.data.mods.length; n++) {
          if (response.data.mods[n] === this.props.auth.username) {
            isMod = true;
          }
        }

        this.setState( () => ({
          postData: response.data.post,
          allComments,
          isAuthor,
          isMod,
          isAdmin,
          postMomentDiff,
          blockedUsers: response.data.blockedUsers
        }))
      })
      .catch( (error) => console.log(error))

  }
  onCommentChange = (e) => {
    const comment = e.target.value;

    this.setState( () => ({comment}))
  }
  createComment = (e) => {
    e.preventDefault();

    const comment = {
      body: this.state.comment,
      post: {},
      author: this.props.auth.username,
      votes: {up: 0, down: 0},
      replies: [],
      dateCreated: moment().format('MMMM Do YYYY, h:mm:ss a')
    }

    axios.post(`/api${this.props.location.pathname}/comment`, comment)
      .then( (response) => {
        const comment = [(
          <div>
            <p>{response.data.body}</p>
            <p>Author: {response.data.author}</p>
          </div>
        )];

        this.setState( (prevState) => {
          return {allComments: prevState.allComments.concat(comment)}
        })

      })
      .catch( (err) => {
        console.log(err)
        console.log('comment failed')
      })

  }
  onVoteClick = (e) => {

    //Check what type of vote it is before posting
    let vote;

    if (e.target.id === 'up-post') {
      vote = 1
    } else {
      vote = -1
    }

    axios.post(`/${this.props.match.params.id}/vote`, {vote: vote, user: this.props.auth.id})
      .then( (response) => {
        if (response.data === 'Error') {
          this.setState( () => ({message: 'Something went wrong'}))
        } else {
          this.setState( () => ({message: 'Vote succesful'}))
        }
      })
      .catch( (error) => {
        console.log(error.response)
        this.setState( () => ({message: 'Something went wrong'}))
      })
  }
  openModal = () => {
    this.setState( () => ({isModalOpen: true}))
  }
  closeModal = () => {
    this.setState( () => ({isModalOpen: false}))
  }
  deletePost = () => {
    axios.delete(`${this.props.location.pathname}/delete`, { data: { id: this.props.match.params.id }})
      .then( () => this.props.history.push('/deleteconfirm'))
      .catch( () => this.setState( () => ({message: 'An error occurred, please try again.'})))
  }
  editPost = () => {
    let data = this.state.postData
    //Need votes and comments to be able to be added during editing
    //Update does not require votes or comments
    delete data.votes
    delete data.comments

    this.props.history.push({
      pathname: `${this.props.location.pathname}/edit`,
      state: { data }
    })
  }
  render() {
    return (
      <div>
        <p>{this.state.message}</p>
        <h1>
          {this.props.location.state ? this.props.location.state.title : this.state.postData.title}
        </h1>
        {this.state.postData && <p>Submitted {this.state.postMomentDiff} by {this.state.postData.author}</p>}
        {
          (this.state.isAuthor || this.state.isAdmin || this.state.isMod) &&
          <button id='post-delete' onClick={this.openModal}>Delete post</button>
        }
        {this.state.isAuthor && <button onClick={this.editPost}>Edit post</button>}
        <p>
          {this.state.postData.body}
        </p>
        {this.props.auth.id ? (
          <div>
            <button id='up-post' onClick={this.onVoteClick}>Upvote</button>
            <button id='down-post' onClick={this.onVoteClick}>Downvote</button>
          </div>
        ) : ''}
        <h3>Comments</h3>
        {this.state.allComments}
        {this.props.auth.id ? (
          <div>
            <h4>Create a comment</h4>
            {/* {(this.state.blockedUsers[this.props.auth.id]) &&
              <div>
                <p>You are currently banned from this community which prevents you from creating comments.</p>
              </div>
            } */}
            <form onSubmit={this.createComment}>
              <input
                type='text'
                value={this.state.comment}
                onChange={this.onCommentChange}
                disabled={(this.state.blockedUsers[this.props.auth.id])}
              />
              <button disabled={(this.state.blockedUsers[this.props.auth.id])}>Create comment</button>
            </form>
          </div>
        ) : ''}
        <Modal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.closeModal}
          contentLabel="Delete Confirmation"
        >
          <h2>Are you sure you want to delete this post?</h2>
          <button onClick={this.deletePost}>Yes</button>
          <button onClick={this.closeModal}>No</button>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(PostPage);
