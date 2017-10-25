import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Alert extends PureComponent {
  render() {
    return (
      <div className='alert-component'>
        {this.props.children}
      </div>
    );
  }
}

Alert.propTypes = {
  children: PropTypes.any,
};
