import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Color from 'color';

import floodFill from '../util/floodFill';

const IMAGE_WIDTH = 480;
const IMAGE_HEIGHT = 270;

function getCursorPos(e, image) {
  const { x, y, width, height } = image.getBoundingClientRect();
  const { clientX, clientY } = e;
  return {
    x: (clientX - x) / width,
    y: (clientY - y) / height,
  };
}

function union(original, dest) {
  return Object.assign({}, original, {
    minX: Math.min(original.minX, dest.minX),
    maxX: Math.max(original.maxX, dest.maxX),
    minY: Math.min(original.minY, dest.minY),
    maxY: Math.max(original.maxY, dest.maxY),
  });
}

function isInRect(rect, x, y) {
  return rect.minX <= x && x <= rect.maxX && rect.minY <= y && y <= rect.maxY;
}

// Workaround for React SVG bug..
class Rect extends PureComponent {
  componentDidMount() {
    this.node.addEventListener('mousedown', this.props.onMouseDown);
  }
  componentWillUnmount() {
    this.node.removeEventListener('mousedown', this.props.onMouseDown);
  }
  render() {
    return (
      <rect {...this.props} ref={node => this.node = node} />
    );
  }
}

const BoundingBox = connect(
  ({ entities }, { imageTag }) => ({ tag: entities.tag[imageTag.tagId] }),
)(({
  active,
  imageTag: { minX, minY, maxX, maxY },
  tag = {},
  onMouseDown = () => {},
}) => {
  let color = tag.color || '#f0f';
  let negative = Color(color).luminosity() < 0.5;
  let x = minX * IMAGE_WIDTH;
  let y = minY * IMAGE_HEIGHT;
  let width = (maxX - minX) * IMAGE_WIDTH;
  let height = (maxY - minY) * IMAGE_HEIGHT;
  return (
    <g className={classNames('bounding-box', { active, negative })}>
      <rect x={x} y={y} width={width} height={height}
        className='shadow' />
      <rect x={x} y={y} width={width} height={height}
        className='bg' />
      <Rect x={x} y={y} width={width} height={height}
        style={{ stroke: color }}
        onClick={onMouseDown.bind(null, null, null)}
        onMouseDown={onMouseDown.bind(null, null, null)}
        className='fg' />
      <Rect x={x - 3} y={y - 3} width={7} height={7}
        onMouseDown={onMouseDown.bind(null, 'minX', 'minY')}
        className='handle top-left' />
      <Rect x={x + width - 3} y={y - 3} width={7} height={7}
        onMouseDown={onMouseDown.bind(null, 'maxX', 'minY')}
        className='handle top-right' />
      <Rect x={x - 3} y={y + height - 3} width={7} height={7}
        onMouseDown={onMouseDown.bind(null, 'minX', 'maxY')}
        className='handle bottom-left' />
      <Rect x={x + width - 3} y={y + height - 3} width={7} height={7}
        onMouseDown={onMouseDown.bind(null, 'maxX', 'maxY')}
        className='handle bottom-right' />
    </g>
  );
});

export default class Viewport extends PureComponent {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }
  getImageData() {
    if (this.imageData != null) return this.imageData;
    let canvas = document.createElement('canvas');
    canvas.width = this.rawImage.width;
    canvas.height = this.rawImage.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(this.rawImage, 0, 0,
      this.rawImage.width, this.rawImage.height);
    this.imageData =
      ctx.getImageData(0, 0, this.rawImage.width, this.rawImage.height);
    return this.imageData;
  }
  loadImage() {
    if (this.rawImageLoad != null) return this.rawImageLoad;
    let promise = new Promise((resolve, reject) => {
      this.rawImage = new Image();
      this.rawImage.src = this.props.rawSrc;
      this.rawImage.onload = () => {
        resolve();
      };
    });
    this.rawImageLoad = promise;
    return promise;
  }
  handleTagMouseDown(id, xName, yName, e) {
    // If xName or yName is specified, register mouseMove event -
    // move the property around.
    e.preventDefault();
    e.stopPropagation();
  }
  handleMouseDown(e) {
    // click: select
    // ctrl+click: flood fill
    // shift+click: new
    // Let's make a sample tag using flood fill....
    const { x, y } = getCursorPos(e.nativeEvent, this.image);
    let imageData = null;
    this.loadImage().then(() => {
      imageData = this.getImageData();
      this.props.onAdd(floodFill(imageData, x, y));
    });
    // Register mousemove / mouseup event too.
    let mouseMove = e => {
      if (imageData == null) return;
      const { x, y } = getCursorPos(e, this.image);
      let input = this.props.tags[this.props.selected];
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      if (isInRect(input, x, y)) return;
      // Expand the area
      let area = floodFill(imageData, x, y);
      this.props.onChange(this.props.selected, union(input, area));
    };
    let mouseUp = e => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);
  }
  render() {
    const { src, tags, selected } = this.props;
    return (
      <div className='viewport' onMouseDown={this.handleMouseDown}>
        <img src={src} width={IMAGE_WIDTH} height={IMAGE_HEIGHT}
          ref={node => this.image = node} />
        <svg className='svg-overlay' width={IMAGE_WIDTH} height={IMAGE_HEIGHT}>
          { tags.map((tag, i) => (
            <BoundingBox imageTag={tag} color={tag.tag && tag.tag.color}
              active={i === selected} key={i}
              onMouseDown={this.handleTagMouseDown.bind(this, i)} />
          )) }
        </svg>
      </div>
    );
  }
}

Viewport.propTypes = {
  src: PropTypes.string.isRequired,
  rawSrc: PropTypes.string,
  tags: PropTypes.array,
  selected: PropTypes.number,
  onChange: PropTypes.func,
  onAdd: PropTypes.func,
  onSelect: PropTypes.func,
};

