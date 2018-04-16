import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

class Post extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      comment: '',
      postData: ''
    }
  }
  componentDidMount() {
    //If the user trys to access the page without going through the react router
    //I.e. directly entering the URL in the browser
    axios.post(`${this.props.location.pathname}`)
      .then( (response) => {
        this.setState( () => ({postData: response.data}))
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
      author: {
        _id: this.props.auth.id
      }
    }

    axios.post(`${this.props.location.pathname}/comment`, comment)
      .then( () => {
        console.log('comment added')
      })
      .catch( () => {
        console.log('comment failed')
      })

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
        <h3>Comments</h3>
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
