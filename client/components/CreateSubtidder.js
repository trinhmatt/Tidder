import React from 'react'


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
  createSubtidder = () => {
    const subtidder = {
      name: this.state.name,
      description: this.state.desc,
      ageRestricted: this.state.ageRestricted,
      mods: [{
        id: this.state.id
      }]
    }
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
          />
          <input
            type='textarea'
            placeholder='description'
            value={this.state.desc}
            onChange={this.onDescChange}
          />
          <div>
            <label>Age restricted?</label>
            <input type='radio' value={true} onClick={this.onRestrictSelect} />
            <input type='radio' value={false} onClick={this.onRestrictSelect} />
          </div>
          <button>Create</button>
        </form>
      </div>
    )
  }
}
