import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import uuid from 'uuid'
import { startCreateSub } from '../../store/actions/create'


class CreateSubtidder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      desc: '',
      ageRestricted: false,
      isPrivate: false,
      permittedPosts: {
        text: false,
        video: false,
        picture: false
      },
      id: '',
      error: ''
    }
  }
  onRestrictSelect = (e) => {
    const ageRestricted = e.target.value;

    this.setState( () => ({ageRestricted}))
  }
  onPrivateSelect = (e) => {
    const isPrivate = e.target.value;

    this.setState( () => ({isPrivate}))
  }
  onNameChange = (e) => {
    const name = e.target.value

    this.setState( () => ({name}))
  }
  onDescChange = (e) => {
    const desc = e.target.value

    this.setState( () => ({desc}))
  }
  onPostTypeSelect = (e) => {
    const type = e.target.id

    this.setState( (prevState) => {
      return {
        permittedPosts: {
          ...prevState.permittedPosts,
          [type]: !prevState.permittedPosts[type]
        }
      }
    })
  }
  createSubtidder = (e) => {
    e.preventDefault();

    let sub = {
      name: this.state.name,
      description: this.state.desc,
      ageRestricted: this.state.ageRestricted,
      admin: this.props.auth.id,
      permittedPosts: this.state.permittedPosts,
      isPrivate: this.state.isPrivate
    }

    if (this.state.isPrivate) {
      sub.subKey = uuid();
    } else {
      sub.subKey = '';
    }

    axios.post('/createsubtidder', sub)
      .then( (response) => {
        if (response.data.indexOf('error') > -1) {
          this.setState( () => ({error: response.data}))
        } else {
          this.props.history.push({
            pathname: '/createsubtidder/success',
            state: { subKey: sub.subKey }
          })
        }
      })
      .catch( (error) => {
        this.props.history.push({
          pathname: '/createsubtidder/fail',
          state: { error }
        })
      })
  }
  render() {
    return (
      <div>
        <h1>Create Subtidder</h1>
        <h2 className='error-message'>{this.state.error}</h2>
        <form onSubmit={this.createSubtidder}>
          <input
            type='text'
            placeholder='subtidder name'
            value={this.state.name}
            onChange={this.onNameChange}
            required
          />
          <input
            type='textarea'
            placeholder='description'
            value={this.state.desc}
            onChange={this.onDescChange}
          />
          <div>
            <label>Age restricted?</label>
            <div>
              <input type='radio' value={true} onClick={this.onRestrictSelect} />
              <label>Yes</label>
            </div>
            <div>
              <input type='radio' value={false} onClick={this.onRestrictSelect} />
              <label>No</label>
            </div>
          </div>
          <div>
            <label>Private subreddit?</label>
            <div>
              <input type='radio' value={true} onClick={this.onPrivateSelect} />
              <label>Yes</label>
            </div>
            <div>
              <input type='radio' value={false} onClick={this.onPrivateSelect} />
              <label>No</label>
            </div>
          </div>
          <div>
            <label>Types of posts permitted</label>
            <div>
              <div>
                <input
                  type='checkbox'
                  id='text'
                  onClick={this.onPostTypeSelect}
                />
                <label>Text</label>
              </div>
              <div>
                <input
                  type='checkbox'
                  id='video'
                  onClick={this.onPostTypeSelect}
                />
                <label>Video</label>
              </div>
              <div>
                <input
                  type='checkbox'
                  id='picture'
                  value={this.state.permittedPosts.picture}
                  onClick={this.onPostTypeSelect}
                />
                <label>Picture</label>
              </div>
            </div>
          </div>
          <button>Create</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(CreateSubtidder);
