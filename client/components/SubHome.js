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
      allPosts: []
    }
  }
  componentDidMount() {
    axios.post(`/t/${this.props.match.params.sub}`)
      .then( (response) => {
        const subData = response.data

        if (!subData) {
          this.props.history.push('/404')
        } else {
          let allPosts = [];
          //Set up posts for render
          for (let i = 0; i<subData.posts.length; i++) {
            const post = (
              <div key={subData.posts[i]._id}>
                <p>Votes: {subData.posts[i].votes.up + subData.posts[i].votes.down}</p>
                <Link
                  to={{
                    pathname: `/t/${this.props.match.params.sub}/${subData.posts[i]._id}`,
                    state: {
                      title: subData.posts[i].title,
                      body: subData.posts[i].body,
                      author: subData.posts[i].author
                    }
                  }}>{subData.posts[i].title}
                </Link>
              </div>
            )
            allPosts.push(post)
          }

          // Generate create links needs to be called after subData is set
          this.setState( () => ({subData, allPosts}), this.generateCreateLinks)
        }
      })
      .catch( () => console.log('could not get sub data'))
  }
  subscribeToSub = () => {
    axios.post(`/subscribe/${this.props.id}`, this.state.subData)
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
        {this.props.id ? <button onClick={this.subscribeToSub}>Subscribe</button> : ''}
        {this.state.typeLinks}
        {this.state.allPosts}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  id: state.auth.id
})

const mapDispatchToProps = (dispatch) => ({
  startSubscribe: (userID, subID) => dispatch(startSubscribe(userID, subID))
})

export default connect(mapStateToProps)(SubHome);
