import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Modal from 'react-modal'
import PostDiv from './PostDiv'


class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commentsToRender: [],
      postsToRender: [],
      dataFound: false,
      savedLink: false,
      isModalOpen: false,
      message: '',
      messageStatus: ''
    }
  }
  componentDidMount() {
    axios.get(`/${this.props.match.params.username}/profiledata`)
    .then( (response) => {
      //Mongo doesnt throw an error if nothing is found
      //Needed in case the user doesnt exist
      if (response.data.message) {
        this.setState( () => ({error: 'Could not find user'}))
      } else {
        this.setState( () => ({
          userData: response.data,
          dataFound: true,
          //Only show saved link if username matches
          savedLink: (response.data.user === this.props.auth.username)
        }))
      }
    })
    .catch( (err) => {
      this.setState( () => ({error: 'Could not find user'}))
    })
  }
  componentDidUpdate() {
    //FOr some reason this produces the maximum depth exceeded error
    //The components still render properly, do not know why it is throwing an error
    if (this.state.dataFound) {
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
          <PostDiv key={this.state.userData.posts[x]._id} postData={this.state.userData.posts[x]} match={match} />
        );
        postsToRender.push(postComponent);
      }

      this.setState( () => ({commentsToRender, postsToRender, dataFound: false}))
    }
  }
  openMessageConsole = () => {
    this.setState( () => ({isModalOpen: true}));
  }
  onMessageChange = (e) => {
    const message = e.target.value;

    this.setState( () => ({message}));
  }
  sendMessage = (e) => {
    e.preventDefault();

    const message = {
      message: this.state.message,
      timestamp: moment().format("MMMM Do YYYY, h:mm:ss a")
    };

    axios.post(`/api/message/${this.props.auth.id}/${this.props.match.params.username}`, message)
      .then( (response) => this.setState( () => ({messageStatus: 'Message sent!'})))
      .catch( (err) => this.setState( () => ({messageStatus: 'An error occurred, please try again.'})))
  }
  closeModal = () => {
    this.setState( () => ({isModalOpen: false}));
  }
  render() {
    return (
      <div>
        {this.state.error ? <h1>{this.state.error}</h1> : <h1>{this.props.match.params.username}</h1>}
        {this.props.auth.id &&
          <div>
            <button onClick={this.openMessageConsole}>Send a message</button>
          </div>}
        {(this.props.auth.id && this.state.savedLink) && <Link to={{
          pathname: (this.props.location.pathname) + '/saved'
        }}>Saved posts</Link>}
        <div>
          <h1>Comments</h1>
          {this.state.commentsToRender}
        </div>
        <div>
          <h1>Posts</h1>
          {this.state.postsToRender}
        </div>
        <Modal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.closeModal}
          contentLabel="Delete Confirmation"
        >
          <h1>Send a message</h1>
          <p>{this.state.messageStatus}</p>
          <form onSubmit={this.sendMessage}>
            <textarea
              value={this.state.message}
              onChange={this.onMessageChange}
            />
            <button>Send</button>
          </form>
          <div>
            <button onClick={this.closeModal}>Close message console</button>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Profile);
