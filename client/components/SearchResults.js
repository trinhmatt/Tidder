import React from 'react'
import { Link } from 'react-router-dom'
import PostDiv from './PostDiv'

class SearchResults extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      resultsToRender: ''
    }
  }
  componentDidMount() {
    const results = this.props.location.state.results;
    let resultsToRender = {
      subs: [],
      posts: []
    };

    if (results.subs.length > 0) {
      for (let i = 0; i<results.subs.length; i++) {

        const subDiv = (
          <div>
            <Link to={`/t/${results.subs[i].name}`}>{results.subs[i].name}</Link>
          </div>
        );

        resultsToRender.subs.push(subDiv)
      }
    }

    if (results.posts.length > 0) {
      for (let n = 0; n<results.posts.length; n++) {
        //Have to do this due to the way I set up PostDiv
        //Need to fix this, there is a better way
        const dummyMatch = {params: {sub: results.posts[n].subName} };

        const postDiv = <PostDiv key={n} match={dummyMatch} postData={results.posts[n]} />;

        resultsToRender.posts.push(postDiv)
      }
    }

    this.setState( () => ({resultsToRender}))

  }
  render() {
    return (
      <div>
        <h2>Search Results</h2>
        <div>
          <h1>Subs</h1>
          {this.state.resultsToRender.subs}
        </div>
        <div>
          <h1>Posts</h1>
          {this.state.resultsToRender.posts}
        </div>
      </div>
    )
  }
}

export default SearchResults;
