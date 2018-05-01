import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

class CreatePost extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      body: '',
      link: ''
    }
  }
  generateInput = () => {
    let inputToRender;

    //Check what type of post this is supposed to be and render the appropriate input
    if (this.props.location.state.type.indexOf('text') < 0) {
      inputToRender = (
        <input
          placeholder='link'
          type='text'
          value={this.state.link}
          onChange={this.onLinkChange}
          required
        />
      )
      return inputToRender
    }
    return null
  }
  onBodyChange = (e) => {
    const body = e.target.value

    this.setState( () => ({body}))
  }
  onTitleChange = (e) => {
    const title = e.target.value

    this.setState( () => ({title}))
  }
  onLinkChange = (e) => {
    const link = e.target.value

    this.setState( () => ({link}))
  }
  createPost = (e) => {
    e.preventDefault();

    const post = {
      title: this.state.title,
      body: this.state.body,
      link: this.state.link,
      postType: this.props.location.state.type,
      author: this.props.username,
      sub: this.props.location.state.subId,
      votes: {up: 0, down: 0}
    }

    axios.post(`${this.props.location.pathname}`, post)
      .then( (response) => {
        this.props.history.push(`${this.props.location.pathname}/success`)
      })
      .catch( () => this.props.history.push(`${this.props.location.pathname}/fail`))

  }
  render() {
    return (
      <div>
        <h1>Create {this.props.location.state.type} post</h1>
        <form onSubmit={this.createPost}>
          <input
            type='text'
            placeholder='Title'
            value={this.state.title}
            onChange={this.onTitleChange}
            required
          />
          <textarea
            placeholder='Post Body'
            value={this.state.body}
            onChange={this.onBodyChange}
          />
          {this.generateInput()}
          <button>Submit</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  username: state.auth.username
})

export default connect(mapStateToProps)(CreatePost);
