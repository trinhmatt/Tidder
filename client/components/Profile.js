import React from 'react'
import { connect } from 'react-redux'

class Profile extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  render() {
    return (
      <div>
        <h1>{this.props.match.params.username}</h1>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Profile);
