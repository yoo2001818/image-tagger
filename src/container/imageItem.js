import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ImageItem extends PureComponent {
  render() {
    const { image } = this.props;
    return (
      <div className='image-item'>
        <div className='viewport'>
          <img src={`/api/images/${image.id}/thumb`} width={320} height={180} />
          <svg className='svg-overlay' width={320} height={180}
            viewBox='0 0 1 1' preserveAspectRatio='none'
          >
            <g className='bounding-box'>
              <rect x={0.25} y={0.25}
                width={0.3} height={0.3}
                className='shadow' />
              <rect x={0.25} y={0.25}
                width={0.3} height={0.3}
                className='bg' />
              <rect x={0.25} y={0.25}
                width={0.3} height={0.3}
                className='fg' />
            </g>
          </svg>
        </div>
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

