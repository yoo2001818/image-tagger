import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import { loadList, patch, destroy, post } from '../action/image';

class ImageList extends Component {
  componentWillMount() {
    this.props.loadList('main', {}, true);
  }
  handleLoad() {
    this.props.loadList('main', {});
  }
  render() {
    const { list = {}, entities } = this.props;
    const items = ((list || {}).items || []).map(v => entities[v]);
    console.log(list);
    return (
      <InfiniteScroll className='image-list' hasMore={list.hasNext}
        loadMore={this.handleLoad.bind(this)}
      >
        <ul className='list'>
          { items.map((v, i) => (
            <li className='image' key={i}>
              <img src={`/api/images/${v.id}/thumb`} width={320} height={180} />
              <div className='path'>{ v.path }</div>
            </li>
          )) }
        </ul>
      </InfiniteScroll>
    );
  }
}

export default connect(
  ({ image }) => ({ list: image.lists.main, entities: image.entities }),
  { loadList, patch, destroy, post },
)(ImageList);

