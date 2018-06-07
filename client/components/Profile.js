import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import PostDiv from './PostDiv'


class Profile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      commentsToRender: [],
      postsToRender: [],
      dataFound: false
    }
  }
  componentDidMount() {
    axios.get(`/${this.props.match.params.username}/profiledata`)
    .then( (response) => {
      this.setState( () => ({userData: response.data}))
    })
    .catch( (err) => {
      console.log(err)
    })
  }
  componentDidUpdate() {
    //FOr some reason this produces the maximum depth exceeded error
    //The components still render properly, do not know why it is throwing an error
    if (!this.state.commentsFound) {
      let commentsToRender = [];
      let postsToRender = [];

      for (let i = 0; i<this.state.userData.comments.length; i++) {
        const commentComponent = (
          <div key={`${this.state.userData.comments[i]._id}`}>
            <h3>{`${this.state.userData.comments[i].post.title}`}</h3>
            <p>{`${this.state.userData.comments[i].body}`}</p>
          </div>
        );
        commentsToRender.push(commentComponent);
      }

      for (let x = 0; x<this.state.userData.posts.length; x++) {
        const match = {params: {sub: this.state.userData.posts[x].subName}};
        const postComponent = (
          <PostDiv postData={this.state.userData.posts[x]} match={match} />
        );
        postsToRender.push(postComponent);
      }

      this.setState( () => ({commentsToRender, postsToRender, dataFound: true}))
    }
    //In the case that the user has not created any comments
    //Need to stop the lifecycle method from looping forever
    this.setState( () => ({dataFound: true}))

  }
  render() {
    return (
      <div>
        <h1>{this.props.match.params.username}</h1>
        {this.props.auth.id ? <Link to={(this.props.location.pathname) + '/saved'}>Saved posts</Link> : ''}
        <div>
          <h1>Comments</h1>
          {this.state.commentsToRender}
        </div>
        <div>
          <h1>Posts</h1>
          {this.state.postsToRender}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Profile);
