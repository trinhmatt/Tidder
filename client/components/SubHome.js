import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class SubHome extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      subData: '',
      message: '',
      subData: {}
    }
  }
  componentDidMount() {
    axios.post(`/t/${this.props.match.params.sub}`)
      .then( (response) => {
        const subData = response.data

        if (!subData) {
          this.props.history.push('/404')
        } else {
          this.setState( () => ({subData}))
        }
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
        <h1>{this.state.subData.name}</h1>
        <h2>{this.state.subData.description}</h2>
        {this.state.message}
        <button onClick={this.subscribeToSub}>Subscribe</button>
        <Link to={`/${this.props.match.params.sub}/createpost`}>Create text post</Link>
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
