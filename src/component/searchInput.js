import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import TextInput from './ui/textInput';

export default class SearchInput extends PureComponent {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.node = null;
  }
  handleKeyDown(e) {
    // 48-57, 65-90
    if (e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!((e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 65 && e.keyCode <= 90))) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (this.node == null) return;
    this.node.value = '';
    this.node.focus();
  }
  componentDidMount() {
    if (this.props.isGlobal) {
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }
  componentWillUnmount() {
    if (this.props.isGlobal) {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }
  handleChange(e) {
    if (this.props.onChange) this.props.onChange(e);
  }
  render() {
    const { type = 'text', placeholder = 'Search...', value } = this.props;
    return (
      <TextInput type={type} placeholder={placeholder} value={value}
        inputRef={node => this.node = node}
        onChange={this.handleChange.bind(this)} />
    );
  }
}

SearchInput.propTypes = {
  className: PropTypes.string,
  isGlobal: PropTypes.bool,
  onChange: PropTypes.func,
};
