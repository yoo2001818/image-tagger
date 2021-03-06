import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

// Full-sized loading page.

export default class FullOverlay extends PureComponent {
  render() {
    const { children, filter, transparent, center } = this.props;
    return (
      <div className={classNames('full-overlay', {
        filter, transparent, center,
      })}>
        <div className='container'>
          <div className='message'>
            <div className='children'>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FullOverlay.propTypes = {
  children: PropTypes.node,
  filter: PropTypes.bool,
  transparent: PropTypes.bool,
  center: PropTypes.bool,
};
