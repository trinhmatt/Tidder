import React from 'react'
import axios from 'axios'
import Modal from 'react-modal'

class EditPost extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      body: this.props.location.state.postData.body,
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
    const update = {...this.props.location.state.postData, body: this.state.body}

    axios.put(`${this.props.location.pathname}`, update)
    .then( () => this.props.history.push(`${this.props.location.pathname}/success`))
    .catch( () => this.props.history.push(`${this.props.location.pathname}/fail`))
  }
  render() {
    return (
      <div>
        <h1>Edit post</h1>
        <h2>{this.props.location.state.postData.title}</h2>
        <p>Note: Titles cannot be edited</p>
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
