import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class PostDiv extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      pathname: `/t/${this.props.match.params.sub}/${this.props.postData._id}`
    }
  }
  componentDidMount() {
    if (this.props.postData.postType.indexOf('text') < 0) {
      this.setState( () => ({pathname: this.props.postData.link}))
    }
  }
  onVoteClick = (e) => {
    //Check if user is logged in
    if (!this.props.auth.id) {
      this.setState( () => ({message: 'Please login to do that'}))
    } else {
      //Check what type of vote it is before posting
      let vote;

      if (e.target.id === 'up-post') {
        vote = 1
      } else {
        vote = -1
      }

      axios.post(`/${this.props.postData._id}/vote`, {vote: vote, user: this.props.auth.id})
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
      <div key={this.props.postData._id}>
        <div>
          <p>{this.state.message}</p>
        </div>
        <div>
          <button id='up-post' onClick={this.onVoteClick}>Upvote</button>
          <button onClick={this.onVoteClick}>Downvote</button>
        </div>
        <p>Votes: {this.props.postData.votes.up + this.props.postData.votes.down}</p>
        {/* Cannot use Link for some reason, it cuts off the pathname if conditionally rendered */}
        <a href={this.state.pathname}>{this.props.postData.title}</a>
        <div>
          <Link
            to={{
              pathname: `/t/${this.props.match.params.sub}/${this.props.postData._id}`,
              state: {
                title: this.props.postData.title,
                body: this.props.postData.body,
                author: this.props.postData.author
              }
            }}>Comments
          </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(PostDiv)
