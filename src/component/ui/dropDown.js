import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Portal from 'react-portal-minimal';

export default class DropDown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
    };
    this.handleClickEvent = this.handleClick.bind(this);
    this.handleScrollEvent = this.calculateRect.bind(this);
    this.handleGlobalKeyEvent = this.handleGlobalKey.bind(this);
  }
  calculateRect() {
    let { innerWidth, innerHeight } = window;
    if (this.node == null) return;
    let nodeRect = this.node.getBoundingClientRect();
    let x, y;
    let alignRect = this.topNode.getBoundingClientRect();
    if (this.props.top) {
      y = alignRect.top - nodeRect.height;
      if (y < 0) {
        y = Math.min(innerHeight - nodeRect.height, alignRect.bottom);
      }
    } else {
      y = alignRect.bottom;
      if (y + nodeRect.height > innerHeight) {
        y = Math.max(0, alignRect.top - nodeRect.height);
      }
    }
    if (this.props.right) {
      x = alignRect.right - nodeRect.width;
      if (x < 0) {
        x = Math.min(innerWidth - nodeRect.width, alignRect.right);
      }
    } else {
      x = alignRect.left;
      if (x + nodeRect.width > innerWidth) {
        x = Math.max(0, alignRect.right - nodeRect.width);
      }
    }
    this.setState({ x, y });
  }
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
    if (this.coverNode != null) {
      this.coverNode.removeEventListener('click', this.handleClickEvent);
    }
  }
  handleKeyDown(e) {
    switch (e.keyCode) {
      case 13:
      case 32:
        this.handleClick(e);
        break;
      case 38: // up
        if (!this.state.hidden) this.handleClick(e);
        break;
      case 40: // down
        if (this.state.hidden) this.handleClick(e);
        break;
    }
  }
  handleGlobalKey(e) {
    switch (e.keyCode) {
      case 8:
      case 27:
        if (!this.state.hidden) this.handleClick(e);
        break;
    }
  }
  handleClick(e) {
    const { hidden } = this.state;
    if (this.mounted) {
      this.setState({
        hidden: !hidden,
        x: -10000,
        y: -10000,
      });
      setTimeout(() => {
        if (hidden) {
          this.coverNode.addEventListener('click', this.handleClickEvent);
          // document.addEventListener('keydown', this.handleGlobalKeyEvent);
          document.addEventListener('scroll', this.handleScrollEvent);
          this.calculateRect();
        } else {
          // this.coverNode.removeEventListener('click', this.handleClickEvent);
          // document.removeEventListener('keydown', this.handleGlobalKeyEvent);
          document.removeEventListener('scroll', this.handleScrollEvent);
        }
      }, 0);
    }
    e.preventDefault();
  }
  render() {
    const { hidden } = this.state;
    const { className } = this.props;
    const buttonContent = (
      <a href={this.props.href || '#'} tabIndex={-1}>
        <span className='title'>{this.props.title}</span>
      </a>
    );
    return (
      <div className={classNames('drop-down-component', { hidden }, className)}
        ref={node => this.topNode = node}
      >
        <div className='button'
          onClick={this.handleClick.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
          tabIndex={0}
        >
          {buttonContent}
        </div>
        { !hidden && (
          <Portal className='drop-down-portal'>
            <div className={classNames('wrapper', className)}>
              <div className='cover' ref={node => this.coverNode = node} />
              <div className='container'
                style={{
                  position: 'fixed',
                  left: this.state.x + 'px',
                  top: this.state.y + 'px',
                }}
              >
                <div className='content'
                  onClick={this.props.preventClose
                    ? undefined : this.handleClick.bind(this)}
                  ref={node => this.node = node}
                >
                  { this.props.children }
                </div>
              </div>
            </div>
          </Portal>
        ) }
      </div>
    );
  }
}

DropDown.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.node,
  preventClose: PropTypes.bool,
  className: PropTypes.string,
};
