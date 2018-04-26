import React from 'react'
import axios from 'axios'
import Modal from 'react-modal'

class EditPost extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      body: this.props.location.state.data.body,
      isModalOpen: false
    }
  }
  onBodyChange = (e) => {
    const body = e.target.value;

    this.setState( () => ({body}))
  }
  openModal = (e) => {
    e.preventDefault();

    this.setState( () => ({isModalOpen: true}))
  }
  closeModal = () => {
    this.setState( () => ({isModalOpen: false}))
  }
  submitEdit = () => {
    const update = {...this.props.location.state.data, body: this.state.body}
    const redirectURL = '/t/' + this.props.match.params.sub + '/' + this.props.match.params.id + '/edit/success'
    const redirectURLFail = '/t/' + this.props.match.params.sub + '/' + this.props.match.params.id + '/edit/fail'

    axios.put(`${this.props.location.pathname}`, update)
    .then( () => this.props.history.push(redirectURL))
    .catch( () => this.props.history.push(redirectURLFail))
  }
  render() {
    return (
      <div>
        <h1>Edit post</h1>
        <h2>{this.props.location.state.data.title}</h2>
        {this.props.location.state.data.title ? <p>Note: Titles cannot be edited</p> : ''}
        <form onSubmit={this.openModal}>
          <textarea value={this.state.body} placeholder={this.state.body} onChange={this.onBodyChange} />
          <button>Submit Changes</button>
        </form>
        <Modal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.closeModal}
          contentLabel="Edit Confirmation"
          >
            <h2>Are you sure you want to submit these changes?</h2>
            <button onClick={this.submitEdit}>Yes</button>
            <button onClick={this.closeModal}>No</button>
        </Modal>
      </div>
    )
  }
}

export default EditPost;
