import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class TextInput extends PureComponent {
  render() {
    return (
      <input
        type='text'
        {...this.props}
        className={classNames('text-input-component', this.props.className)}
        ref={v => this.input = v}
      />
    );
  }
}

TextInput.propTypes = {
  className: PropTypes.string,
};
