import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Button extends PureComponent {
  handleClick(event) {
    if (this.props.onClick) this.props.onClick(event);
  }
  render() {
    const { className, children, disabled, div, href, tabIndex } = this.props;
    if (href) {
      return (
        <a
          href={href}
          className={classNames('button-component', className)}
          onClick={this.handleClick.bind(this)}
          disabled={disabled}
          ref={v => this.button = v}
        >
          {children}
        </a>
      );
    }
    if (div) {
      return (
        <div
          className={classNames('button-component', className)}
          onClick={this.handleClick.bind(this)}
          disabled={disabled}
          ref={v => this.button = v}
          tabIndex={tabIndex == null ? -1 : tabIndex}
        >
          {children}
        </div>
      );
    }
    return (
      <button
        className={classNames('button-component', className)}
        onClick={this.handleClick.bind(this)}
        disabled={disabled}
        ref={v => this.button = v}
      >
        {children}
      </button>
    );
  }
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  div: PropTypes.bool,
  href: PropTypes.string,
  tabIndex: PropTypes.number,
};
