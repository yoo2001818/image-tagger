import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import TagItem from './tagItem';

import { loadList, patch, destroy, post } from '../action/tag';

class TagList extends Component {
  componentWillMount() {
    this.props.loadList('main', {}, true);
  }
  handleLoad() {
    this.props.loadList('main', {});
  }
  render() {
    const { list = {} } = this.props;
    const items = list.items || [];
    return (
      <InfiniteScroll className='tag-list' hasMore={list.hasNext}
        loadMore={this.handleLoad.bind(this)}
      >
        <ul className='list'>
          { items.map((v) => (
            <li className='tag' key={v}>
              <TagItem id={v} />
            </li>
          )) }
          <TagItem id='new' isNew />
        </ul>
      </InfiniteScroll>
    );
  }
}

export default connect(
  state => ({ list: state.tag.main }),
  { loadList, patch, destroy, post },
)(TagList);

