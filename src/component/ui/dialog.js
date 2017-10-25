import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Dialog extends PureComponent {
  render() {
    const { title, children } = this.props;
    return (
      <div className='dialog-component'>
        <h1 className='title'>
          {title}
        </h1>
        <div className='content'>
          {children}
        </div>
      </div>
    );
  }
}

Dialog.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
};

export class Controls extends PureComponent {
  render() {
    return (
      <div className='dialog-controls-component'>
        {this.props.children}
      </div>
    );
  }
}

Controls.propTypes = {
  children: PropTypes.node,
};
