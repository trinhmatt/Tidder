import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import PostDiv from './PostDiv'

class SubHome extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      openAdminControls: false,
      modDivs: [],
      subPass: '',
      subData: {},
      typeLinks: [],
      allPosts: [],
      isSubbed: false,
      blockAccess: false,
      modalMessage: ''
    }
  }
  componentDidMount() {
    axios.post(`/t/${this.props.match.params.sub}`)
      .then( (response) => {
        const subData = response.data;
        let isSubbed = false;
        let blockAccess = false;
        let showPass = false;
        let isAdmin = false;

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
            isSubbed = true;
          }

          if (subData.sub.isPrivate && !isSubbed) {
            blockAccess = true;
          }

          if (subData.sub.admin === this.props.auth.id) {
            showPass = true
            isAdmin = true
          }

          // Generate create links needs to be called after subData is set
          this.setState( () => ({
            subData: subData.sub,
            allPosts,
            isSubbed,
            blockAccess,
            showPass,
            isAdmin
          }), this.generateCreateLinks)
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
  onPassChange = (e) => {
    const subPass = e.target.value;

    this.setState( () => ({subPass}))


  }
  onPassSubmit = (e) => {
    e.preventDefault();

    let blockAccess = true;

    if (this.state.subPass === this.state.subData.subKey) {
      blockAccess = false;
    }

    this.setState( () => ({blockAccess}))
  }
  openAdmin = () => {
    let modDivs = [];

    for (let i = 0; i<this.state.subData.mods.length; i++) {
      const modDiv = (
        <div key={this.state.subData.mods[i]}>
          <p>{this.state.subData.mods[i]}</p>
          <button id={this.state.subData.mods[i]}>Delete mod</button>
        </div>
      )
      modDivs.push(modDiv)
    }
    this.setState( () => ({openAdminControls: true, modDivs}))
  }
  closeAdminControls = () => {
    this.setState( () => ({openAdminControls: false}))
  }
  onNewModChange = (e) => {
    const newMod = e.target.value;

    this.setState( () => ({newMod}))
  }
  addMod = () => {
    const newMod = {newMod: this.state.newMod};

    axios.post(`/${this.state.subData._id}/addmod`, newMod)
      .then( (response) => {
        if (response.data._id) {
          const newModDiv = [(
            <div>
              <p>{newMod.newMod}</p>
              <button id={newMod.newMod}>Remove mod</button>
            </div>
          )]

          this.setState( (prevState) => ({
            modDivs: prevState.modDivs.concat(newModDiv),
            modalMessage: 'Mod succesfully added',
            newMod: ''
          }))
        }
      })
      .catch( (error) => {
        let modalMessage;

        if (error.response.statusText === 'Not Found') {
          modalMessage = 'User was not found, please try again'
        } else {
          modalMessage = 'Something went wrong, please wait and try again'
        }

        this.setState( () => ({modalMessage}))
      })
  }
  render() {
    return (
      <div>
        { this.state.blockAccess ?
          <div>
            <h1>This is a private community</h1>
            <p>Please enter the password in order to gain access</p>
            <form onSubmit={this.onPassSubmit}>
              <input
                type='password'
                value={this.state.subPass}
                onChange={this.onPassChange}
              />
              <button>Submit</button>
            </form>
          </div> :
          <div>
            <h1>{this.state.subData.name}</h1>
            <h2>{this.state.subData.description}</h2>
            {this.state.showPass && <h2>The password to the subtidder is: {this.state.subData.subKey}</h2>}
            {this.state.isAdmin &&
              <div>
                <button onClick={this.openAdmin}>Admin controls</button>
              </div>
            }
            {this.state.message}
            {(this.props.auth.id && !this.state.isSubbed) ? <button onClick={this.subscribeToSub}>Subscribe</button> : ''}
            {this.state.typeLinks}
            {this.state.allPosts}
            <Modal
              isOpen={this.state.openAdminControls}
              onRequestClose={this.closeAdminControls}
              contentLabel="Admin Controls"
            >
              <h1>Admin controls</h1>
              <div>
                <h3>Moderators</h3>
                <p>{this.state.modalMessage}</p>
                {this.state.modDivs}
                <p>Add a moderator</p>
                <input
                  type='text'
                  value={this.state.newMod}
                  onChange={this.onNewModChange}
                  placeholder='username'
                />
                <button onClick={this.addMod}>Add mod</button>
              </div>
            </Modal>
          </div>
        }
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
