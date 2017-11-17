import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class TagItem extends PureComponent {
  render() {
    const { tag } = this.props;
    return (
      <div className='tag-item'>
        { tag.name }
      </div>
    );
  }
}

TagItem.propTypes = {
  tag: PropTypes.object,
};

export default connect(
  ({ entities }, props) => ({ tag: entities.tag[props.id] }),
)(TagItem);

