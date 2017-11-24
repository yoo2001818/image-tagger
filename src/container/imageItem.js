import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Color from 'color';

const IMAGE_WIDTH = 320;
const IMAGE_HEIGHT = 180;

const BoundingBox = ({ active, color, minX, minY, maxX, maxY }) => {
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
};

function colorDist(data, pos, targetPos) {
  let output = 0;
  for (let i = 0; i < 4; ++i) {
    let diff = data[pos + i] - data[targetPos + i];
    if (diff < 0) output -= diff;
    else output += diff;
  }
  return output;
}

class ImageItem extends PureComponent {
  floodFill(_x, _y) {
    const { width, height, data } = this.getImageData();
    let x = _x * width | 0;
    let y = _y * height | 0;
    const ctx = this.canvas.getContext('2d');
    const { width: outputWidth, height: outputHeight } = this.canvas;
    ctx.clearRect(0, 0, outputWidth, outputHeight);
    let output = ctx.getImageData(0, 0, outputWidth, outputHeight);
    let visited = new Uint8Array(width * height);
    let queue = [{ x, y }];
    let targetPos = (x + y * width) * 4;
    let test = (x, y) => colorDist(data, (x + y * width) * 4, targetPos) < 15;
    while (queue.length > 0) {
      const { x, y } = queue.pop();
      if (visited[x + y * width]) continue;
      let xMin = x;
      let xMax = x;
      while (xMin >= 0 && test(xMin, y, xMin + 1, y)) xMin--;
      while (xMax < width && test(xMax, y, xMax - 1, y)) xMax++;
      for (let tx = xMin; tx <= xMax; ++tx) {
        visited[tx + y * width] = 1;
        {
          let downX = tx / width * outputWidth | 0;
          let downY = y / height * outputHeight | 0;
          output.data[(downX + downY * outputWidth) * 4] = 255;
          output.data[(downX + downY * outputWidth) * 4 + 3] = 255;
        }
        if (y < height && test(tx, y + 1, tx, y) &&
          !visited[tx + (y + 1) * width]
        ) {
          queue.push({ x: tx, y: y + 1 });
        }
        if (y < height && test(tx, y - 1, tx, y) &&
          !visited[tx + (y - 1) * width]
        ) {
          queue.push({ x: tx, y: y - 1 });
        }
      }
    }
    ctx.putImageData(output, 0, 0);
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
      const { image } = this.props;
      this.rawImage = new Image();
      this.rawImage.src = `/api/images/${image.id}/raw`;
      this.rawImage.onload = () => {
        resolve();
      };
    });
    this.rawImageLoad = promise;
    return promise;
  }
  handleClick(e) {
    const { x, y, width, height } = this.image.getBoundingClientRect();
    const { clientX, clientY } = e.nativeEvent;
    this.loadImage().then(() => {
      this.floodFill((clientX - x) / width, (clientY - y) / height);
    });
  }
  render() {
    const { image } = this.props;
    return (
      <div className='image-item'>
        <div className='viewport' onClick={this.handleClick.bind(this)}>
          <img src={`/api/images/${image.id}/thumb`} width={320} height={180}
            ref={node => this.image = node} />
          <canvas className='test-overlay' width={320} height={180}
            ref={node => this.canvas = node} />
          <svg className='svg-overlay' width={320} height={180}
            viewBox='0 0 320 180' preserveAspectRatio='none'
          >
            <BoundingBox color='#4C4C4C' minX={0.25} minY={0.2} maxX={0.8} maxY={0.6} active />
            <BoundingBox color='#986043' minX={0.1} minY={0.1} maxX={0.3} maxY={0.4} />
            <BoundingBox color='#ECEAE0' minX={0.5} minY={0.5} maxX={0.6} maxY={0.7} />
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

