import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import ImageItem from './imageItem';

import { loadList, patch, destroy, post } from '../action/image';

class ImageList extends Component {
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
      <InfiniteScroll className='image-list' hasMore={list.hasNext}
        loadMore={this.handleLoad.bind(this)}
      >
        <ul className='list'>
          { items.map(id => (
            <li className='image' key={id}>
              <ImageItem id={id} />
            </li>
          )) }
        </ul>
      </InfiniteScroll>
    );
  }
}

export default connect(
  state => ({ list: state.image.main }),
  { loadList, patch, destroy, post },
)(ImageList);

