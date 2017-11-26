import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Color from 'color';

import { addTag, setTag } from '../action/image';

import floodFill, { colorDist } from '../util/floodFill';
import getEntry from '../util/getEntry';

const IMAGE_WIDTH = 320;
const IMAGE_HEIGHT = 180;

const BoundingBox = connect(
  ({ entities }, { imageTag }) => ({ tag: entities.tag[imageTag.tagId] }),
)(({ active, imageTag: { minX, minY, maxX, maxY }, tag = {} }) => {
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
      <rect x={x} y={y} width={width} height={height}
        style={{ stroke: color }}
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
});

function getCursorPos(e, image) {
  const { x, y, width, height } = image.getBoundingClientRect();
  const { clientX, clientY } = e;
  return {
    x: (clientX - x) / width,
    y: (clientY - y) / height,
  };
}

class Viewport extends PureComponent {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
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
    if (this.rawImageLoad != null) {
      return this.rawImageLoad;
    }
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
  onMouseDown(e) {
    // click: select
    // ctrl+click: flood fill
    // shift+click: new
    // Let's make a sample tag using flood fill....
    const { x, y } = getCursorPos(e.nativeEvent, this.image);
    let lastPos = 0;
    let imageData = null;
    this.loadImage().then(() => {
      imageData = this.getImageData();
      lastPos = ((x * imageData.width | 0) +
        (y * imageData.height | 0) * imageData.width) * 4;
      this.props.onCreate(floodFill(imageData, x, y));
    });
    // Register mousemove / mouseup event too.
    let mouseMove = e => {
      if (imageData == null) return;
      const { x, y } = getCursorPos(e, this.image);
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      let pos = ((x * imageData.width | 0) +
        (y * imageData.height | 0) * imageData.width) * 4;
      if (colorDist(imageData.data, pos, lastPos) < 15) return;
      lastPos = pos;
      console.log(x, y);
      // Expand the area
      let area = floodFill(imageData, x, y);
      let input = this.props.tags[this.props.selected];
      let output = Object.assign({}, input, {
        minX: Math.min(area.minX, input.minX),
        maxX: Math.max(area.maxX, input.maxX),
        minY: Math.min(area.minY, input.minY),
        maxY: Math.max(area.maxY, input.maxY),
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
  render() {
    const { src, tags, selected } = this.props;
    return (
      <div className='viewport' onMouseDown={this.onMouseDown}>
        <img src={src} width={IMAGE_WIDTH} height={IMAGE_HEIGHT}
          ref={node => this.image = node} />
        <svg className='svg-overlay' width={IMAGE_WIDTH} height={IMAGE_HEIGHT}>
          { tags.map((tag, i) => (
            <BoundingBox imageTag={tag} color={tag.tag && tag.tag.color}
              active={i === selected} key={i} />
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
  onCreate: PropTypes.func,
  onSelect: PropTypes.func,
};

class ImageItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { selected: null };
  }
  handleCreateTag(data) {
    const { addTag, id, selectedTag, image } = this.props;
    addTag(id,
      Object.assign({}, data, { tag: selectedTag, tagId: selectedTag }));
    this.setState({ selected: getEntry(image, 'imageTags').length });
  }
  handleChangeTag(tagId, data) {
    const { setTag, id } = this.props;
    setTag(id, tagId, data);
  }
  render() {
    const { image } = this.props;
    const { selected } = this.state;
    return (
      <div className='image-item'>
        <Viewport
          src={`/api/images/${image.id}/thumb`}
          rawSrc={`/api/images/${image.id}/raw`}
          tags={getEntry(image, 'imageTags')} selected={selected}
          onCreate={this.handleCreateTag.bind(this)}
          onChange={this.handleChangeTag.bind(this)}
        />
        <ul className='image-tags'>
          <li className='tag'>
            Test
          </li>
        </ul>
        <div className='path'>{ image.path }</div>
      </div>
    );
  }
}

ImageItem.propTypes = {
  image: PropTypes.object,
};

export default connect(
  ({ entities, tag }, props) => ({
    image: entities.image[props.id],
    selectedTag: tag.selected,
  }),
  { addTag, setTag }
)(ImageItem);

