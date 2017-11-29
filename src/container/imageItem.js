import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import getEntry from '../util/getEntry';

import Button from '../component/ui/button';
import Viewport from './viewport';

import { addTag, setTag, removeTag, set, undo, redo, save, reset }
  from '../action/image';

const ImageTag = connect(
  ({ entities }, { imageTag }) => ({ tag: entities.tag[imageTag.tagId] }),
)(({
  selected,
  tag = {},
  onClick,
}) => {
  let color = tag.color || '#f0f';
  return (
    <button className={classNames('image-tag', { selected })}
      title={tag.name}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
});

class ImageItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { selected: null };
  }
  handleAddTag(data, undoable) {
    const { addTag, id, selectedTag, image } = this.props;
    addTag(id,
      Object.assign({}, data, { tag: selectedTag, tagId: selectedTag }),
      undoable);
    this.setState({ selected: getEntry(image, 'imageTags').length });
  }
  handleChangeTag(tagId, data, undoable) {
    const { setTag, id } = this.props;
    setTag(id, tagId, data, undoable);
  }
  handleRemoveTag(tagId, undoable) {
    const { removeTag, id } = this.props;
    removeTag(id, tagId, undoable);
    this.setState({ selected: this.state.selected - 1 });
  }
  handleSelectTag(tagId) {
    this.setState({ selected: tagId });
  }
  handleKeyDown(e) {
    if (e.ctrlKey && e.keyCode === 90) {
      this.props.undo(this.props.id);
      e.preventDefault();
    }
    if (e.ctrlKey && e.keyCode === 89) {
      this.props.redo(this.props.id);
      e.preventDefault();
    }
  }
  handleMouseDown() {
    this.node.focus();
  }
  handleTagClick(tagId, e) {
    e.preventDefault();
    this.handleSelectTag(tagId);
  }
  handleSave() {
    this.props.save(this.props.id);
  }
  handleReset() {
    this.props.reset(this.props.id);
  }
  handleChange(name, e) {
    this.props.set(this.props.id, { [name]: e.target.checked });
  }
  render() {
    const { image } = this.props;
    const { selected } = this.state;
    const tags = getEntry(image, 'imageTags');
    return (
      <div className='image-item' tabIndex={0}
        onKeyDown={this.handleKeyDown.bind(this)}
        ref={node => this.node = node}
      >
        <Viewport
          src={`/api/images/${image.id}/thumb`}
          rawSrc={`/api/images/${image.id}/raw`}
          tags={tags} selected={selected}
          onAdd={this.handleAddTag.bind(this)}
          onChange={this.handleChangeTag.bind(this)}
          onRemove={this.handleRemoveTag.bind(this)}
          onSelect={this.handleSelectTag.bind(this)}
          onMouseDown={this.handleMouseDown.bind(this)}
        />
        <ul className='image-tags'>
          { tags.map((v, i) => (
            <li className='tag' key={i}>
              <ImageTag imageTag={v} selected={selected === i}
                onClick={this.handleTagClick.bind(this, i)} />
            </li>
          )) }
        </ul>
        <div className='path'>{ image.path }</div>
        <div className='checkboxes'>
          <label>
            <input type='checkbox' name='isProcessed'
              checked={getEntry(image, 'isProcessed')}
              onChange={this.handleChange.bind(this, 'isProcessed')} />
            완료
          </label>
          <label>
            <input type='checkbox' name='isIgnored'
              checked={getEntry(image, 'isIgnored')}
              onChange={this.handleChange.bind(this, 'isIgnored')} />
            무시
          </label>
        </div>
        <div className='actions'>
          { image.modified && (
            <Button className='green save'
              onClick={this.handleSave.bind(this)}
            >
              저장
            </Button>
          ) }
          { image.modified && (
            <Button className='orange undo'
              onClick={this.handleReset.bind(this)}
            >
              되돌리기
            </Button>
          ) }
        </div>
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
  { addTag, setTag, removeTag, set, undo, redo, save, reset }
)(ImageItem);

