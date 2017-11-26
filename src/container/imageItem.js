import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import getEntry from '../util/getEntry';

import Viewport from './viewport';

import { addTag, setTag, removeTag } from '../action/image';

class ImageItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { selected: null };
  }
  handleAddTag(data) {
    const { addTag, id, selectedTag, image } = this.props;
    addTag(id,
      Object.assign({}, data, { tag: selectedTag, tagId: selectedTag }));
    this.setState({ selected: getEntry(image, 'imageTags').length });
  }
  handleChangeTag(tagId, data) {
    const { setTag, id } = this.props;
    setTag(id, tagId, data);
  }
  handleRemoveTag(tagId) {
    const { removeTag, id } = this.props;
    removeTag(id, tagId);
    this.setState({ selected: this.state.selected - 1 });
  }
  handleSelectTag(tagId) {
    this.setState({ selected: tagId });
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
          onAdd={this.handleAddTag.bind(this)}
          onChange={this.handleChangeTag.bind(this)}
          onRemove={this.handleRemoveTag.bind(this)}
          onSelect={this.handleSelectTag.bind(this)}
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
  { addTag, setTag, removeTag }
)(ImageItem);

