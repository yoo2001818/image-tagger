import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Section extends PureComponent {
  render() {
    const { title, children } = this.props;
    return (
      <section className='section-component'>
        <h1 className='title'>
          {title}
        </h1>
        <div className='content'>
          {children}
        </div>
      </section>
    );
  }
}

Section.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
};
