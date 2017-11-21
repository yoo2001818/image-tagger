import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import TagItem from './tagItem';
import SearchInput from '../component/searchInput';

import { loadList, patch, destroy, post } from '../action/tag';

// TODO Move it to somewhere else
function escapeRegExp(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

class TagList extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: '' };
  }
  componentWillMount() {
    this.props.loadList('main', {}, true);
  }
  handleLoad() {
    this.props.loadList('main', {});
  }
  handleFilterChange(e) {
    this.setState({ filter: e.target.value });
  }
  render() {
    const { filter } = this.state;
    const { list = {}, entities = {} } = this.props;
    const regex = new RegExp(filter.split('').map(escapeRegExp).join('.*'));
    const items = filter ? (list.items || []).filter(
      id => entities[id] && regex.test(entities[id].name),
    ) : (list.items || []);
    return (
      <InfiniteScroll className='tag-list' hasMore={list.hasNext}
        loadMore={this.handleLoad.bind(this)}
      >
        <div className='search'>
          <SearchInput type='text' placeholder='Search...' isGlobal
            value={filter} onChange={this.handleFilterChange.bind(this)} />
        </div>
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

TagList.propTypes = {
  filter: PropTypes.string,
};

export default connect(
  // TODO Reselect
  state => ({ list: state.tag.list.main, entities: state.entities.tag }),
  { loadList, patch, destroy, post },
)(TagList);

