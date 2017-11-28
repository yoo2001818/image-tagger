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

function subtract(original, dest, x, y) {
  // Check if they overlap first
  if (Math.min(original.maxX, dest.maxX) < Math.max(original.minX, dest.minX) ||
    Math.min(original.maxY, dest.maxY) < Math.max(original.minY, dest.minY)
  ) return original;
  // Calculate distance between two midpoints
  let xDist = x - (original.maxX + original.minX) / 2;
  let yDist = y - (original.maxY + original.minY) / 2;
  console.log(xDist, yDist);
  console.log(original, dest);
  if (Math.abs(xDist) > Math.abs(yDist)) {
    if (original.maxX <= dest.maxX) {
      return Object.assign({}, original, { maxX: dest.minX });
    } else {
      return Object.assign({}, original, { minX: dest.maxX });
    }
  } else {
    if (original.maxY <= dest.maxY) {
      return Object.assign({}, original, { maxY: dest.minY });
    } else {
      return Object.assign({}, original, { minY: dest.maxY });
    }
  }
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
        onMouseDown={onMouseDown.bind(null, false, false)}
        className='handle top-left' />
      <Rect x={x + width - 3} y={y - 3} width={7} height={7}
        onMouseDown={onMouseDown.bind(null, true, false)}
        className='handle top-right' />
      <Rect x={x - 3} y={y + height - 3} width={7} height={7}
        onMouseDown={onMouseDown.bind(null, false, true)}
        className='handle bottom-left' />
      <Rect x={x + width - 3} y={y + height - 3} width={7} height={7}
        onMouseDown={onMouseDown.bind(null, true, true)}
        className='handle bottom-right' />
    </g>
  );
});

export default class Viewport extends PureComponent {
  constructor(props) {
    super(props);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
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
  handleTagMouseDown(id, xType, yType, e) {
    if (e.ctrlKey || e.shiftKey) return;
    if (this.props.onMouseDown) this.props.onMouseDown(e);
    // If xName or yName is specified, register mouseMove event -
    // move the property around.
    e.preventDefault();
    e.stopPropagation();
    if (xType == null || yType == null) {
      this.props.onSelect(id);
    } else {
      // TODO Rename database?
      let xName = xType ? 'maxX' : 'minX';
      let yName = yType ? 'maxY' : 'minY';
      // First, calculate actual distance between cursor x and y.
      const cursorPos = getCursorPos(e, this.image);
      const input = this.props.tags[this.props.selected];
      const xDiff = cursorPos.x - input[xName];
      const yDiff = cursorPos.y - input[yName];
      this.props.onChange(this.props.selected, input, true);
      // Register mousemove / mouseup event too.
      let mouseMove = e => {
        const { x, y } = getCursorPos(e, this.image);
        let xValue = x - xDiff;
        let yValue = y - yDiff;
        if (xType) xValue = Math.max(input.minX, xValue);
        else xValue = Math.min(input.maxX, xValue);
        if (yType) yValue = Math.max(input.minY, yValue);
        else yValue = Math.min(input.maxY, yValue);
        let output = Object.assign({}, input, {
          [xName]: xValue,
          [yName]: yValue,
        });
        this.props.onChange(this.props.selected, output);
      };
      let mouseUp = e => {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
      };
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    }
  }
  handleMouseDown(e) {
    // click: select
    // shift+click: flood fill
    // ctrl+click: new
    if (this.props.onMouseDown) this.props.onMouseDown(e);
    if (e.ctrlKey && e.button === 2) {
      e.preventDefault();
      this.props.onRemove(this.props.selected);
      return;
    }
    if (e.ctrlKey || e.shiftKey) {
      const shiftKey = e.shiftKey;
      const ctrlKey = e.ctrlKey;
      e.preventDefault();
      const handleUnion = (x, y, undoable) => {
        if (imageData == null) return;
        let input = this.props.tags[this.props.selected];
        // Expand the area
        let area = floodFill(imageData, x, y);
        let output;
        if (ctrlKey && shiftKey) {
          output = subtract(input, area, x, y);
        } else {
          output = union(input, area);
        }
        this.props.onChange(this.props.selected, output, undoable);
      };
      let imageData = null;
      const { x, y } = getCursorPos(e.nativeEvent, this.image);
      this.loadImage().then(() => {
        imageData = this.getImageData();
        if ((ctrlKey && !shiftKey) ||
            this.props.tags[this.props.selected] == null
        ) {
          this.props.onAdd(floodFill(imageData, x, y), true);
        } else {
          handleUnion(x, y, true);
        }
      });
      // Register mousemove / mouseup event too.
      let mouseMove = e => {
        const { x, y } = getCursorPos(e, this.image);
        if (x < 0 || x > 1 || y < 0 || y > 1) return;
        let input = this.props.tags[this.props.selected];
        if (!(ctrlKey && shiftKey) && isInRect(input, x, y)) return;
        handleUnion(x, y);
      };
      let mouseUp = e => {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
      };
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    }
  }
  handleContextMenu(e) {
    e.preventDefault();
  }
  render() {
    const { src, tags, selected } = this.props;
    // Reorder tags - 0 ~ selected tags should be rendered first,
    // then selected ~ N tags should be rendered, while reversed.
    // selected tag should be rendered at last.
    let tagsResult;
    let tagsMapped = tags.map((value, id) => ({ value, id }));
    if (tags[selected] != null) {
      tagsResult = tagsMapped.slice(0, selected).reverse().concat(
        tagsMapped.slice(selected).reverse(),
      );
    } else {
      tagsResult = tagsMapped;
    }
    return (
      <div className='viewport' onMouseDown={this.handleMouseDown}
        onContextMenu={this.handleContextMenu}
      >
        <img src={src} width={IMAGE_WIDTH} height={IMAGE_HEIGHT}
          ref={node => this.image = node} />
        <svg className='svg-overlay' width={IMAGE_WIDTH} height={IMAGE_HEIGHT}>
          { tagsResult.map((v) => (
            <BoundingBox imageTag={v.value}
              active={v.id === selected} key={v.id}
              onMouseDown={this.handleTagMouseDown.bind(this, v.id)} />
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
  onRemove: PropTypes.func,
  onSelect: PropTypes.func,
  onMouseDown: PropTypes.func,
};

