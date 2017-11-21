import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import TagItem from './tagItem';
import SearchInput from '../component/searchInput';

import filterEntities from '../util/filterEntities';

import { loadList, select } from '../action/tag';

class TagList extends PureComponent {
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
    const { value } = e.target;
    this.setState({ filter: value });
    const { list = {}, entities = {}, select } = this.props;
    let selectedId = filterEntities(list.items, value,
      id => entities[id] && entities[id].name)[0];
    if (selectedId != null) select(selectedId);
  }
  render() {
    const { filter } = this.state;
    const { list = {}, entities = {} } = this.props;
    const items = filterEntities(list.items, filter,
      id => entities[id] && entities[id].name);
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
  { loadList, select },
)(TagList);

