import React from 'react'
import axios from 'axios'
import { history } from '../routes/AppRouter'

class HeaderSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchValue: ''
    }
  }
  onSearchChange = (e) => {
    const searchValue = e.target.value;

    this.setState( () => ({searchValue}));
  }
  submitSearch = (e) => {
    e.preventDefault();

    const searchQuery = {searchQuery: this.state.searchValue}

    axios.post('/api/search', searchQuery)
      .then( (response) => {
        history.push({
          pathname: '/searchresults',
          state: { results: response.data }
        })
      })
      .catch( (error) => {
        console.log(error)
      })
  }
  render() {
    return (
      <div>
        <form onSubmit={this.submitSearch}>
          <input
            type='text'
            placeholder='Search...'
            value={this.state.searchValue}
            onChange={this.onSearchChange}
          />
          {/* <button>Sub</button> */}
        </form>
      </div>
    )
  }
}

export default HeaderSearch;
