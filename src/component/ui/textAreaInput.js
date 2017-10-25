import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class TextAreaInput extends PureComponent {
  render() {
    return (
      <textarea
        {...this.props}
        className={
          classNames('text-input-component', this.props.className)}
        ref={v => this.input = v}
      />
    );
  }
}

TextAreaInput.propTypes = {
  className: PropTypes.string,
};
