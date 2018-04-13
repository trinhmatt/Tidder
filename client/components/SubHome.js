import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

class SubHome extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      subData: '',
      message: ''
    }
  }
  componentDidMount() {
    axios.post(`/t/${this.props.match.params.sub}`)
      .then( (response) => {
        const subData = response.data

        this.setState( () => ({subData}))
      })
      .catch( () => console.log('could not get sub data'))
  }
  subscribeToSub = () => {
    axios.post(`/subscribe/${this.props.id}`, this.state.subData)
      .then( () => {
        this.setState(() => ({message: 'Subscription succesful'}))
      })
      .catch( () => {
        this.setState( () => ({message: 'Something happened, try again?'}))
      })
  }
  render() {
    return (
      <div>
        <h1>Sub home</h1>
        {this.state.message}
        <button onClick={this.subscribeToSub}>Subscribe</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  id: state.auth.id
})

const mapDispatchToProps = (dispatch) => ({
  startSubscribe: (userID, subID) => dispatch(startSubscribe(userID, subID))
})

export default connect(mapStateToProps)(SubHome);
