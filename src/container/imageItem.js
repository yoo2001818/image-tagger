import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ImageItem extends PureComponent {
  render() {
    const { image } = this.props;
    return (
      <div className='image-item'>
        <img src={`/api/images/${image.id}/thumb`} width={320} height={180} />
        <div className='path'>{ image.path }</div>
      </div>
    );
  }
}

ImageItem.propTypes = {
  image: PropTypes.object,
};

export default connect(
  ({ entities }, props) => ({ image: entities.image[props.id] }),
)(ImageItem);

