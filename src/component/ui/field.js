import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Field extends PureComponent {
  render() {
    const { label, children } = this.props;
    return (
      <div className='field-component'>
        <label>
          <span className='label'>
            {label}
          </span>
          <span className='content'>
            {children}
          </span>
        </label>
      </div>
    );
  }
}

Field.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node,
};
