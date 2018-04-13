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
  createSubtidder = (e) => {
    e.preventDefault();

    const sub = {
      name: this.state.name,
      description: this.state.desc,
      ageRestricted: this.state.ageRestricted,
      mods: [],
      admin: this.props.auth.id
    }

    axios.post('/createsubtidder', sub)
      .then( () => {
        this.props.history.push('/createsubtidder/success')
      })
      .catch( () => {
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
