import React from 'react'
import axios from 'axios'

class Comment extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      comment: ''
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

    console.log(e.target.value)
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
          { (this.props.commentData.author === this.props.auth.username) ? (
            <div id={this.props.commentData._id}>
              <button onClick={this.openModal}>Delete</button>
              <button onClick={this.editComment}>Edit</button>
            </div>
          ) : '' }
        </div>
        <p>{this.props.commentData.body}</p>
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
      </div>
    )
  }
}

export default Comment;
