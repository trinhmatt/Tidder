import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

class Post extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      comment: '',
      postData: '',
      allComments: []
    }
  }
  componentDidMount() {
    let allComments = [];

    //If the user trys to access the page without going through the react router
    //I.e. directly entering the URL in the browser

    axios.post(`${this.props.location.pathname}`)
      .then( (response) => {
        for (let i = 0; i<response.data.comments.length; i++) {
          const commentDiv = (
            <div key={i}>
              <p>{response.data.comments[i].body}</p>
              <p>Author: {response.data.comments[i].author}</p>
            </div>
          )
          allComments.push(commentDiv)
        }
        this.setState( () => ({postData: response.data, allComments}))
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

    axios.post(`${this.props.location.pathname}/comment`, comment)
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
  submitPostVote = (e) => {

    //Check what type of vote it is before posting

    if (e.target.id === 'up-post') {
      axios.post(`${this.props.location.pathname}/vote`, {vote: 1})
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
    } else {
      axios.post(`${this.props.location.pathname}/vote`, {vote: -1})
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
  }
  commentVote = (e) => {
    if (e.target.id === 'up-comment') {
      axios.post(`${this.props.location.pathname}/vote/comment`, {vote: 1})
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
    } else {
      axios.post(`${this.props.location.pathname}/vote/comment`, {vote: -1})
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
  }
  render() {
    return (
      <div>
        <h1>
          {this.props.location.state ? this.props.location.state.title : this.state.postData.title}
        </h1>
        <p>
          {this.props.location.state ? this.props.location.state.body : this.state.postData.body}
        </p>
        {this.props.auth.id ? (
          <div>
            <button id='up-post' onClick={this.submitPostVote}>Upvote</button>
            <button id='down-post' onClick={this.submitPostVote}>Downvote</button>
            <p>{this.state.message}</p>
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
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Post);
