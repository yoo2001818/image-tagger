import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class TextInput extends PureComponent {
  render() {
    // Seriously React?
    const props = Object.assign({}, this.props);
    delete props.inputRef;
    return (
      <input
        type='text'
        {...props}
        className={classNames('text-input-component', this.props.className)}
        ref={this.props.inputRef}
      />
    );
  }
}

TextInput.propTypes = {
  className: PropTypes.string,
};
