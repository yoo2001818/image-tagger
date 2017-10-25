import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class ReadInput extends PureComponent {
  render() {
    const { label, value } = this.props;
    return (
      <div className='read-input-component'>
        <label>
          <span className='label'>
            {label}
          </span>
          <span className='field'>
            {value}
          </span>
        </label>
      </div>
    );
  }
}

ReadInput.propTypes = {
  label: PropTypes.node,
  value: PropTypes.node,
};
