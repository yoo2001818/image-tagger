import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ColorInput from '../component/ui/colorInput';

// TODO FocusGroup
class TagItem extends PureComponent {
  render() {
    const { tag } = this.props;
    return (
      <div className='tag-item'>
        <ColorInput className='color' />
        <span className='name'>
          { tag.name }
        </span>
        <button className='edit' />
        <button className='delete' />
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

