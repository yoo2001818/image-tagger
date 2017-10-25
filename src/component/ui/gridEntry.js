import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class GridEntry extends PureComponent {
  render() {
    const { title, children } = this.props;
    return (
      <div className='grid-entry-component'>
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

GridEntry.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
};
