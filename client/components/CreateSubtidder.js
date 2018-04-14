import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { startCreateSub } from '../../store/actions/create'


class CreateSubtidder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      desc: '',
      ageRestricted: false,
      permittedPosts: {
        text: false,
        video: false,
        picture: false
      },
      id: ''
    }
  }
  onRestrictSelect = (e) => {
    const ageRestricted = e.target.value;

    this.setState( () => ({ageRestricted}))
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

    const sub = {
      name: this.state.name,
      description: this.state.desc,
      ageRestricted: this.state.ageRestricted,
      admin: this.props.auth.id,
      permittedPosts: this.state.permittedPosts
    }

    axios.post('/createsubtidder', sub)
      .then( () => {
        this.props.history.push('/createsubtidder/success')
      })
      .catch( (error) => {
        console.log(error)
        this.props.history.push('/createsubtidder/fail')
      })
  }
  render() {
    return (
      <div>
        <h1>Create Subtidder</h1>
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
