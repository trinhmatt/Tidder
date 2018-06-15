import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PostDiv from './PostDiv'

class SubHome extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      subData: {},
      typeLinks: [],
      allPosts: [],
      isSubbed: false
    }
  }
  componentDidMount() {
    axios.post(`/t/${this.props.match.params.sub}`)
      .then( (response) => {
        const subData = response.data;
        let isSubbed = false;

        if (!subData.sub._id) {
          this.props.history.push('/404')
        } else {
          let allPosts = [];

          subData.sub.posts.sort( (a, b) => (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down));;

          //Set up posts for render
          for (let i = 0; i<subData.sub.posts.length; i++) {
            const post = (
              <PostDiv key={i} postData={subData.sub.posts[i]} match={this.props.match}/>
            )
            allPosts.push(post)
          }

          if (subData.isSubbed) {
            isSubbed = true
          }

          // Generate create links needs to be called after subData is set
          this.setState( () => ({subData: subData.sub, allPosts, isSubbed}), this.generateCreateLinks)
        }
      })
      .catch( () => console.log('could not get sub data'))
  }
  subscribeToSub = () => {
    axios.post(`/subscribe/${this.props.auth.id}`, this.state.subData)
      .then( () => {
        this.setState(() => ({message: 'Subscription succesful'}))
      })
      .catch( () => {
        this.setState( () => ({message: 'Something happened, try again?'}))
      })
  }
  generateCreateLinks = () => {
    let typeLinks = [];

    for (let type in this.state.subData.permittedPosts) {
      if (this.state.subData.permittedPosts[type]) {
        const typeLink = (
          <Link
            key={type}
            to={{
              pathname: `/t/${this.props.match.params.sub}/create`,
              state: { type, subId: this.state.subData._id }
            }}>Create {type} post
          </Link>
        )
        typeLinks.push(typeLink)
      }
    }

    this.setState( () => ({typeLinks}))
  }
  render() {
    return (
      <div>
        <h1>{this.state.subData.name}</h1>
        <h2>{this.state.subData.description}</h2>
        {this.state.message}
        {(this.props.auth.id && !this.state.isSubbed) ? <button onClick={this.subscribeToSub}>Subscribe</button> : ''}
        {this.state.typeLinks}
        {this.state.allPosts}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

const mapDispatchToProps = (dispatch) => ({
  startSubscribe: (userID, subID) => dispatch(startSubscribe(userID, subID))
})

export default connect(mapStateToProps)(SubHome);
