import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'

class PostDiv extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      pathname: `/t/${this.props.match.params.sub}/${this.props.postData._id}`,
      saved: 'Save'
    }
  }
  componentDidMount() {
    //Set the link of the post title to the content if it is not a text post
    if (this.props.postData.postType.indexOf('text') < 0) {
      this.setState( () => ({
        pathname: this.props.postData.link,
        votes: (this.props.postData.votes.up + this.props.postData.votes.down)
      }))
    } else {
      this.setState( () => ({votes: (this.props.postData.votes.up + this.props.postData.votes.down)}))
    }

    //Compare the submission date with the current date
    const postMoment = moment(this.props.postData.dateCreated, 'MMMM Do YYYY, h:mm:ss a');
    const currentMoment = moment();

    const displayDifference = postMoment.from(currentMoment)

    //Check if user has saved the post
    let saved = 'Save';

    if (this.props.auth.id) {
      for (let i=0; i<this.props.auth.savedPosts.length; i++) {
        if (this.props.auth.savedPosts[i].indexOf(this.props.postData._id) > -1) {
          saved = 'Unsave'
          break
        }
      }
    }


    this.setState( () => ({displayDifference, saved}))

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
            this.setState( (prevState) => ({message: 'Vote succesful', votes: prevState.votes + vote}))
          }
        })
        .catch( () => {
          this.setState( () => ({message: 'Something went wrong'}))
        })
    }
  }
  savePost = () => {
    if (this.state.saved.indexOf('Un') < 0) {
      const saved = 'Unsave'

      axios.put(`/${this.props.auth.id}/${this.props.postData._id}/savepost`)
      .then( (response) => {
        this.setState( () => ({saved}))
      })
      .catch( (error) => {
        this.setState( () => ({message: 'Something went wrong, please try again.'}))
      })

    } else {
      const saved = 'Save'

      axios.put(`/${this.props.auth.id}/${this.props.postData._id}/unsavepost`)
      .then( (response) => {
        this.setState( () => ({saved}))
      })
      .catch( (error) => {
        this.setState( () => ({message: 'Something went wrong, please try again.'}))
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
        <p>Votes: {this.state.votes}</p>
        {/* Cannot use Link for some reason, it cuts off the pathname if conditionally rendered */}
        <a href={this.state.pathname}>{this.props.postData.title}</a>
        <div>
          <Link
            to={{
              pathname: `/t/${this.props.postData.subName}/${this.props.postData._id}`,
              state: {
                title: this.props.postData.title,
                body: this.props.postData.body,
                author: this.props.postData.author
              }
            }}>Comments
          </Link>
          <button onClick={this.savePost}>{this.state.saved}</button>
          <p>
            Submitted {this.state.displayDifference + ' '}
            by {this.props.postData.author + ' '}
            {(this.props.match.params.sub) ? '' : ('to ')}
            {(this.props.match.params.sub) ? '' : (<Link to={`/t/${this.props.postData.subName}`}>t/{this.props.postData.subName}</Link>)}
          </p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(PostDiv)
