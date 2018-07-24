import React from 'react'
import axios from 'axios'
import Modal from 'react-modal'
import moment from 'moment'

class Comment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isModalOpen: false,
      commentReply: '',
      allReplies: []
    }
  }
  openCommentReply = (e) => {
    e.target.parentNode.firstChild.style.display = 'block';
  }
  cancelCommentReply = (e) => {
    e.target.parentNode.style.display = 'none';
  }
  onReplyChange = (e) => {
    const commentReply = e.target.value;

    this.setState( () => ({commentReply}));
  }
  submitReply = (e) => {
    e.preventDefault();

    const reply = {reply: {
      body: this.state.commentReply,
      post: this.props.commentData.post,
      author: this.props.auth.username,
      votes: {up: 0, down: 0},
      replies: [],
      dateCreated: moment().format('MMMM Do YYYY, h:mm:ss a')
    }}

    axios.post(`/${this.props.commentData._id}/reply`, reply)
      .then( (response) => console.log(response.data))
      .catch( (error) => console.log(error))
  }
  openModal = () => {
    this.setState( () => ({isModalOpen: true}))
  }
  deleteComment = (e) => {
    //Need to add a way for admins/mods to send the user a message about why their post was deleted
      //Needs to be done after messaging is done
    const commentID = this.props.commentData._id

    axios.delete(`${this.props.location.pathname}/comment/delete`, { data: { id: commentID } })
      .then( () => this.props.history.push('/deleteconfirm'))
      .catch( () => this.setState( () => ({message: 'An error occurred, please try again.'})))
  }
  editComment = (e) => {
    const data = this.props.commentData

    this.props.history.push({
      pathname: `${this.props.location.pathname}/editcomment`,
      state: { data }
    })
  }
  commentVote = (e) => {
    let vote;

    if (e.target.id === 'up-comment') {
      vote = 1
    } else {
      vote = -1
    }

    axios.post(`/${this.props.commentData.post}/vote`, {
      vote: vote,
      user: this.props.auth.id,
      comment: this.props.commentData._id
    })
      .then( (response) => {
        if (response.data === 'Error') {
          this.setState( () => ({message: 'Something went wrong'}))
        } else {
          this.setState( () => ({message: 'Vote succesful'}))
        }
      })
      .catch( () => {
        this.setState( () => ({message: 'Something went wrong'}))
      })
  }
  render() {
    return (
      <div>
        <div>
          <button id='up-comment' onClick={this.commentVote}>Upvote</button>
          <button id='down-comment' onClick={this.commentVote}>Downvote</button>
          { (this.props.commentData.author === this.props.auth.username) && (
            <div id={this.props.commentData._id}>
              <button onClick={this.openModal}>Delete</button>
              <button onClick={this.editComment}>Edit</button>
            </div>
          )}
        </div>
        <p>{this.props.commentData.body}</p>
        <div>
          {this.props.replies}
        </div>
        <p>Submitted by {this.props.commentData.author} {this.props.displayDifference}</p>
        {this.props.auth.id &&
          <div>
            <form onSubmit={this.submitReply} style={{display: 'none'}}>
              <textarea
                value={this.state.commentReply}
                onChange={this.onReplyChange}
              />
              <button type='submit' value='save'>Save</button>
              <button onClick={ (e) => {
                //Prevent cancel button from submitting form, then hide the input
                e.preventDefault();
                e.stopPropagation();
                this.cancelCommentReply(e);
              }}>Cancel</button>
            </form>
            <button onClick={this.openCommentReply}>Reply</button>
          </div>}
        <Modal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.closeModal}
          contentLabel="Delete Confirmation"
        >
          <h2>Are you sure you want to delete this comment?</h2>
          <button onClick={this.deleteComment}>Yes</button>
          <button onClick={this.closeModal}>No</button>
        </Modal>
      </div>
    )
  }
}

export default Comment;
