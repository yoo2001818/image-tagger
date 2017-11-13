import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import { loadList, patch, destroy, post } from '../action/tag';

class TagList extends Component {
  componentWillMount() {
    this.props.loadList('main', {}, true);
  }
  handleLoad() {
    this.props.loadList('main', {});
  }
  render() {
    const { list = {}, entities } = this.props;
    const items = ((list || {}).items || []).map(v => entities[v]);
    return (
      <InfiniteScroll className='tag-list' hasMore={list.hasNext}
        loadMore={this.handleLoad.bind(this)}
      >
        <ul className='list'>
          { items.map((v, i) => (
            <li className='tag' key={i}>
              <div className='name'>{ v.name }</div>
            </li>
          )) }
        </ul>
      </InfiniteScroll>
    );
  }
}

export default connect(
  state => ({ list: state.tag.main, entities: state.entities.tag }),
  { loadList, patch, destroy, post },
)(TagList);

