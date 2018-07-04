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
      modalMessage: '',
      allBannedUsers: []
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
            let post;

            if (subData.sub.blockedUsers[this.props.auth.id]) {
              post = (
                <PostDiv key={i} postData={subData.sub.posts[i]} isBlocked={true} match={this.props.match}/>
              )
            } else {
              post = (
                <PostDiv key={i} postData={subData.sub.posts[i]} isBlocked={false} match={this.props.match}/>
              )
            }
            allPosts.push(post)
          }
          //I can probably do all these checks on the backend
          //TO DO: move all this to serverside
          if (subData.isSubbed) {
            isSubbed = true;
          }

          if (subData.sub.isPrivate && !isSubbed) {
            blockAccess = true;
          }

          if (subData.sub.admin === this.props.auth.id) {
            isAdmin = true;
          }

          if (isAdmin && subData.sub.isPrivate) {
            showPass = true;
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

    if (this.state.subData.blockedUsers[this.props.auth.id]) {
      typeLinks = (
        <div>
          <p>You are banned from this community, which prevents you from creating posts or comments.</p>
        </div>
      )
    } else {
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
          <button onClick={this.deleteMod} id={this.state.subData.mods[i]}>Delete mod</button>
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
              <button onClick={this.deleteMod} id={newMod.newMod}>Remove mod</button>
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
  deleteMod = (e) => {
    const modToDelete = { modToDelete: e.target.id };

    axios.delete(`/${this.state.subData._id}/deletemod`, { data: modToDelete })
      .then( (response) => {
        let modDivs = [];

        for (let i = 0; i<response.data.mods.length; i++) {
          const modDiv = (
            <div key={response.data.mods[i]}>
              <p>{response.data.mods[i]}</p>
              <button onClick={this.deleteMod} id={response.data.mods[i]}>Delete mod</button>
            </div>
          )
          modDivs.push(modDiv)
        }

        this.setState( () => ({modDivs, modalMessage: 'Mod successfully deleted'}))
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
  onBlockUserChange = (e) => {
    const blockedUser = e.target.value;

    this.setState( () => ({blockedUser}))
  }
  onUnblockUserChange = (e) => {
    const unblockedUser = e.target.value;

    this.setState( () => ({unblockedUser}))
  }
  blockUser = () => {
    const blockedUser = {blockedUser: this.state.blockedUser}

    axios.post(`/${this.state.subData._id}/blockuser`, blockedUser)
      .then( (response) => {
        if (response.data) {
          this.setState( () => ({blockedMessage: 'User successfully banned'}))
        }
      })
      .catch( (error) => this.setState( () => ({blockedMessage:
        'User was not found. Please check your internet connection and/or your spelling'})
      ))
  }
  unblockUser = () => {
    const unblockedUser = {unblockedUser: this.state.unblockedUser}

    axios.post(`/${this.state.subData._id}/unblockuser`, unblockedUser)
      .then( (response) => {
        if (response.data) {
          this.setState( () => ({blockedMessage: 'User successfully unbanned'}))
        }
      })
      .catch( (error) => console.log(error.response))
      // this.setState( () => ({blockedMessage:
      //   'User was not found. Please check your internet connection and/or your spelling'})
      // )
  }
  showAllBanned = () => {
    axios.get(`/${this.state.subData._id}/allbanned`)
      .then( (response) => {
        if (response.data.length > 0) {
          let allBannedUsers = [];

          for (let i = 0; i<response.data.length; i++) {
            allBannedUsers.push(<li>{response.data[i]}</li>)
          }

          this.setState( () => ({allBannedUsers}))
        }
      })
      .catch( (error) => console.log(error))
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
              <div>
                <h3>Block a user</h3>
                {this.state.blockedMessage}
                <button onClick={this.showAllBanned}>Show banned users</button>
                <div>
                  <ul>
                    {this.state.allBannedUsers}
                  </ul>
                </div>
                <div>
                  <input
                    type='text'
                    value={this.state.blockedUser}
                    onChange={this.onBlockUserChange}
                    placeholder='username'
                  />
                  <button onClick={this.blockUser}>Block user</button>
                </div>
                <div>
                  <input
                    type='text'
                    value={this.state.unblockedUser}
                    onChange={this.onUnblockUserChange}
                    placeholder='username'
                  />
                  <button onClick={this.unblockUser}>Unblock User</button>
                </div>
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
