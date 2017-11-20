import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ColorInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || '#000',
      focus: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value &&
      this.state.value !== nextProps.value
    ) {
      this.setState({ value: nextProps.value });
    }
  }
  handleChange(e) {
    const { onChange } = this.props;
    if (onChange) onChange(e);
    this.setState({ value: e.target.value });
  }
  handleFocus(e) {
    this.setState({ focus: true });
  }
  handleBlur(e) {
    this.setState({ focus: false });
  }
  render() {
    const { value, focus } = this.state;
    const { className } = this.props;
    return (
      <div className={classNames('color-input', className, { focus })}
        style={{ backgroundColor: value }}
      >
        <input type='color' {...this.props}
          className='form' onChange={this.handleChange.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          onBlur={this.handleBlur.bind(this)} />
      </div>
    );
  }
}

ColorInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};
