import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TextInput from './textInput';

import __ from '../../lang';

export default class ListInput extends PureComponent {
  handleRemove(index) {
    this.props.onChange(this.props.value.filter((_, i) => i !== index));
  }
  handleAdd() {
    if (!this.input.input.value) return;
    this.props.onChange(this.props.value.concat(this.input.input.value));
    this.input.input.value = '';
  }
  handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleAdd();
    }
  }
  render() {
    return (
      <div className='list-input-root'>
        <ul className='list-input'>
          {
            this.props.value.length > 0 ? (
              this.props.value.map((value, index) => (
                <li key={index}>
                  <p className='entry'>{value}</p>
                  <div className='remove-btn' tabIndex={0}
                    onClick={this.handleRemove.bind(this, index)}
                  >
                    <span className='minus-icon' />
                  </div>
                </li>
              ))
            ) : (
              <p className='tip'>{__('ListInputEmptyTip')}</p>
            )
          }
        </ul>
        <div className='list-input-form'>
          <TextInput placeholder={__('ListInputPlaceholder')}
            ref={input => this.input = input}
            onKeyDown={this.handleKeyDown.bind(this)}
          />
          <div className='add-btn' tabIndex={0}
            onClick={this.handleAdd.bind(this)}
          >
            <span className='plus-icon' />
          </div>
        </div>
      </div>
    );
  }
}

ListInput.propTypes = {
  value: PropTypes.array,
  onChange: PropTypes.func,
};
