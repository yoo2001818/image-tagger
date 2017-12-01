import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import ImageItem from './imageItem';

import { loadList, patch, destroy, post } from '../action/image';

class SelectInput extends Component {
  handleChange(e) {
    this.props.onChange({
      target: { value: this.props.values[e.target.value].value },
    });
  }
  render() {
    const { value, values = [] } = this.props;
    return (
      <select value={values.findIndex(v => v.value === value) || 0}
        onChange={this.handleChange.bind(this)}
      >
        { values.map((entry, i) => (
          <option key={i} value={i}>{entry.name}</option>
        )) }
      </select>
    );
  }
}

SelectInput.propTypes = {
  value: PropTypes.any,
  values: PropTypes.array,
  onChange: PropTypes.func,
};

class ImageList extends Component {
  componentWillMount() {
    this.props.loadList('main', {}, true);
  }
  handleLoad() {
    const { list = {} } = this.props;
    this.props.loadList('main', list.filter || {});
  }
  handleChange(name, e) {
    const { list = {} } = this.props;
    this.props.loadList('main',
      Object.assign({}, list.filter, { [name]: e.target.value }), true);
  }
  render() {
    const { list = { filter: {} } } = this.props;
    const items = list.items || [];
    return (
      <InfiniteScroll className='image-list' hasMore={list.hasNext}
        loadMore={this.handleLoad.bind(this)}
      >
        <div className='filter'>
          <label>
            완료
            <SelectInput
              values={[
                { name: '모두', value: null },
                { name: '완료 안함', value: false },
                { name: '완료함', value: true },
              ]}
              value={list.filter.isProcessed}
              onChange={this.handleChange.bind(this, 'isProcessed')} />
          </label>
          <label>
            무시
            <SelectInput
              values={[
                { name: '모두', value: null },
                { name: '무시 안함', value: false },
                { name: '무시함', value: true },
              ]}
              value={list.filter.isIgnored}
              onChange={this.handleChange.bind(this, 'isIgnored')} />
          </label>
        </div>
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
  state => ({ list: state.image.list.main }),
  { loadList, patch, destroy, post },
)(ImageList);

