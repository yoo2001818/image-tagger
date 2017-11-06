import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadList, patch, destroy, post } from '../action/tag';

class TagList extends Component {
  componentWillMount() {
    this.props.loadList('main', {}, true);
  }
  render() {
    const { list, entities } = this.props;
    const items = ((list || {}).items || []).map(v => entities[v]);
    return (
      <div className='tag-list'>
        <ul className='list'>
          { items.map((v, i) => (
            <li className='tag' key={i}>
              { v.name }
            </li>
          )) }
        </ul>
      </div>
    );
  }
}

export default connect(
  ({ tag }) => ({ list: tag.lists.main, entities: tag.entities }),
  { loadList, patch, destroy, post },
)(TagList);

