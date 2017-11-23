import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const IMAGE_WIDTH = 320;
const IMAGE_HEIGHT = 180;

const BoundingBox = ({ active, color, minX, minY, maxX, maxY }) => {
  let x = minX * IMAGE_WIDTH;
  let y = minY * IMAGE_HEIGHT;
  let width = (maxX - minX) * IMAGE_WIDTH;
  let height = (maxY - minY) * IMAGE_HEIGHT;
  return (
    <g className={classNames('bounding-box', { active })}>
      <rect x={x} y={y} width={width} height={height}
        className='shadow' />
      <rect x={x} y={y} width={width} height={height}
        className='bg' />
      <rect x={x} y={y} width={width} height={height}
        className='fg' />
      <rect x={x - 3} y={y - 3} width={7} height={7}
        className='handle top-left' />
      <rect x={x + width - 3} y={y - 3} width={7} height={7}
        className='handle top-right' />
      <rect x={x - 3} y={y + height - 3} width={7} height={7}
        className='handle bottom-left' />
      <rect x={x + width - 3} y={y + height - 3} width={7} height={7}
        className='handle bottom-right' />
    </g>
  );
};

class ImageItem extends PureComponent {
  render() {
    const { image } = this.props;
    return (
      <div className='image-item'>
        <div className='viewport'>
          <img src={`/api/images/${image.id}/thumb`} width={320} height={180} />
          <svg className='svg-overlay' width={320} height={180}
            viewBox='0 0 320 180' preserveAspectRatio='none'
          >
            <BoundingBox minX={0.25} minY={0.2} maxX={0.8} maxY={0.6} active />
            <BoundingBox minX={0.1} minY={0.1} maxX={0.3} maxY={0.4} />
            <BoundingBox minX={0.5} minY={0.5} maxX={0.6} maxY={0.7} />
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

