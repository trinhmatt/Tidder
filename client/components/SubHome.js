import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class SubHome extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      subData: '',
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

        console.log(subData)

        if (!subData.sub._id) {
          this.props.history.push('/404')
        } else {
          let allPosts = [];
          //Set up posts for render
          for (let i = 0; i<subData.sub.posts.length; i++) {
            const post = (
              <div key={subData.sub.posts[i]._id}>
                <p>Votes: {subData.sub.posts[i].votes.up + subData.sub.posts[i].votes.down}</p>
                <Link
                  to={{
                    pathname: `/t/${this.props.match.params.sub}/${subData.sub.posts[i]._id}`,
                    state: {
                      title: subData.sub.posts[i].title,
                      body: subData.sub.posts[i].body,
                      author: subData.sub.posts[i].author
                    }
                  }}>{subData.sub.posts[i].title}
                </Link>
              </div>
            )
            allPosts.push(post)
          }

          if (subData.isSubbed) {
            console.log('isSubbed was true')
            isSubbed = true
          }

          console.log(isSubbed)

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
