import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import getEntry from '../util/getEntry';
import ColorInput from '../component/ui/colorInput';

import { select, reset, set, post, patch, destroy } from '../action/tag';

// TODO FocusGroup
class TagItem extends PureComponent {
  handleEdit(name, e) {
    const { id } = this.props;
    this.props.set(id, { [name]: e.target.value });
  }
  handleSave(e) {
    e.preventDefault();
    // If isNew is true, call post.
    const { post, patch, isNew, id, tag } = this.props;
    if (isNew) {
      post(tag.modified, id);
    } else {
      patch(id, tag.modified);
    }
  }
  handleUndo(e) {
    e.preventDefault();
    this.props.reset(this.props.id);
  }
  handleDelete(e) {
    e.preventDefault();
    if (!confirm('Are you sure?')) return;
    this.props.destroy(this.props.id);
  }
  handleSelect(e) {
    if (this.props.selected) return;
    if (this.props.isNew) return;
    this.props.select(this.props.id);
  }
  render() {
    const { tag = {}, selected, isNew } = this.props;
    return (
      <div
        className={classNames('tag-item', {
          modified: tag.modified, selected,
        })}
        onClick={this.handleSelect.bind(this)}
      >
        <form onSubmit={this.handleSave.bind(this)}>
          <ColorInput className='color' value={getEntry(tag, 'color')}
            onChange={this.handleEdit.bind(this, 'color')}
            disabled={!isNew && !tag.modified && !selected}
          />
          <div className='name-field'>
            { (isNew || tag.modified || selected) ? (
              <input type='text' className='name'
                placeholder={isNew ? 'New tag...' : ''}
                value={getEntry(tag, 'name') || ''}
                onChange={this.handleEdit.bind(this, 'name')}
              />
            ) : (
              <span className='name'>
                {getEntry(tag, 'name')}
              </span>
            ) }
          </div>
          { tag.modified && (
            <button className='save' onClick={this.handleSave.bind(this)} />
          ) }
          { tag.modified && (
            <button className='undo' onClick={this.handleUndo.bind(this)} />
          ) }
          { selected && !isNew && (
            <button className='delete' onClick={this.handleDelete.bind(this)} />
          ) }
        </form>
      </div>
    );
  }
}

TagItem.propTypes = {
  id: PropTypes.any,
  tag: PropTypes.object,
  isNew: PropTypes.bool,
};

export default connect(
  ({ entities, tag }, props) => ({
    tag: entities.tag[props.id], selected: tag.selected === props.id,
  }),
  { select, reset, set, post, patch, destroy },
)(TagItem);

