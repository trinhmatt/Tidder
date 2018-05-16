import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getSubs } from '../../store/actions/subs'
import PostDiv from './PostDiv'

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      allPosts: []
    }
  }
  //Cannot set up posts to render on mount because the mounting occurs before state is mapped to props
  componentDidUpdate() {

    if (this.state.allPosts.length === 0) {
      let allPosts = [];

      for (let i = 0; i<this.props.subs.length; i++) {
        allPosts = allPosts.concat(this.props.subs[i].posts)
      }

      this.setState( () => ({allPosts}), this.generatePosts)
    }

  }
  generatePosts = () => {
    let postsToRender = [];

    for (let n = 0; n<this.state.allPosts.length; n++) {
      const postDiv = <PostDiv key={n} postData={this.state.allPosts[n]} match={this.props.match} />
      postsToRender.push(postDiv)
    }

    this.setState( () => ({postsToRender}))
  }
  render() {
    return (
      <div>
        <h1>Test!!!</h1>
        <Link to='/createsubtidder'>Create subtidder</Link>
        <div>
          {this.state.postsToRender}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  subs: state.subs,
  auth: state.auth
})

export default connect(mapStateToProps)(Home);
