import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Modal from 'react-modal'

class Post extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      comment: '',
      postData: '',
      allComments: [],
      isAuthor: false,
      isModalOpen: false,
      typeOfModal: null,
      commentID: null
    }
  }
  componentDidMount() {
    let allComments = [];
    let isAuthor = false;

    //If the user trys to access the page without going through the react router
    //I.e. directly entering the URL in the browser

    axios.post(`${this.props.location.pathname}`)
      .then( (response) => {
        for (let i = 0; i<response.data.comments.length; i++) {
          const commentDiv = (
            <div key={i}>
              <div>
                <button id='up-comment' onClick={this.commentVote}>Upvote</button>
                <button id='down-comment' onClick={this.commentVote}>Downvote</button>
                { (response.data.comments[i].author === this.props.auth.username) ?
                    <button id={response.data.comments[i]._id} onClick={this.openModal}>Delete</button> : ''
                }
              </div>
              <p>{response.data.comments[i].body}</p>
              <p>Author: {response.data.comments[i].author}</p>
            </div>
          )
          allComments.push(commentDiv)
        }

        if (response.data.author === this.props.auth.username) {
          isAuthor = true;
        }

        this.setState( () => ({postData: response.data, allComments, isAuthor}))
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
      votes: {up: 0, down: 0}
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

    axios.post(`${this.props.location.pathname}/vote`, {vote: vote, user: this.props.auth.id})
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
  commentVote = (e) => {
    let vote;
    const commentId = e.target.parentNode.id

    if (e.target.id === 'up-comment') {
      vote = 1
    } else {
      vote = -1
    }

    axios.post(`${this.props.location.pathname}/comment`, {
      vote: vote,
      user: this.props.auth.id,
      comment: commentId
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
  openModal = (e) => {
    let typeOfModal;
    let commentID = null;

    //Need to check type so I only need to use one Modal
    if (e.target.id.indexOf('post') > -1) {
      typeOfModal = 'post'
    } else {
      commentID = e.target.id
      typeOfModal = 'comment'
    }

    this.setState( () => ({isModalOpen: true, typeOfModal, commentID}))
  }
  closeModal = () => {
    this.setState( () => ({isModalOpen: false}))
  }
  deletePost = () => {
    axios.delete(`${this.props.location.pathname}/delete`, { data: { id: this.props.match.params.id }})
      .then( () => this.props.history.push('/deleteconfirm'))
      .catch( () => this.setState( () => ({message: 'An error occurred, please try again.'})))
  }
  deleteComment = (e) => {
    const commentID = this.state.commentID

    axios.delete(`${this.props.location.pathname}/comment/delete`, { data: { id: commentID } })
      .then( () => this.props.history.push('/deleteconfirm'))
      .catch( () => this.setState( () => ({message: 'An error occurred, please try again.'})))
  }
  render() {
    return (
      <div>
        <p>{this.state.message}</p>
        <h1>
          {this.props.location.state ? this.props.location.state.title : this.state.postData.title}
        </h1>
        {this.state.isAuthor ? <button id='post-delete' onClick={this.openModal}>Delete post</button> : ''}
        <p>
          {this.props.location.state ? this.props.location.state.body : this.state.postData.body}
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
            <form onSubmit={this.createComment}>
              <input
                type='text'
                value={this.state.comment}
                onChange={this.onCommentChange}
              />
              <button>Create comment</button>
            </form>
          </div>
        ) : ''}
        <Modal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.closeModal}
          contentLabel="Delete Confirmation"
        >
          <h2>Are you sure you want to delete this {this.state.typeOfModal}?</h2>
          <button onClick={((this.state.typeOfModal === 'post') ? this.deletePost : this.deleteComment)}>Yes</button>
          <button onClick={this.closeModal}>No</button>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Post);
