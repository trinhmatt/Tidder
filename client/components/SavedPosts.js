import React from 'react'
import PostDiv from './PostDiv'
import axios from 'axios'

class SavedPosts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      allSaved: []
    }
  }
  componentDidMount() {
    axios.get(`/${this.props.match.params.username}/saved`)
    .then( (response) => {
      let allSaved = [];
      for (let i=0; i<response.data[0].savedPosts.length; i++) {
        const postDiv = <PostDiv postData={response.data[0].savedPosts[i]} match={{params: {sub: response.data[0].savedPosts[i].subName}}} />
        allSaved.push(postDiv)
      }

      this.setState( () => ({allSaved}))
    })
    .catch( (error) => {
      this.setState( () => ({error: 'Something went wrong'}))
    })
  }
  render() {
    return (
      <div>
        <h1>Saved posts</h1>
        {this.state.allSaved}
      </div>
    )
  }
}

export default SavedPosts;
