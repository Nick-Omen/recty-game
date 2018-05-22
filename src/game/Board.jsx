import React from 'react';
import PropTypes from 'prop-types';

export default class Board extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]).isRequired
  };

  renderChildren() {
    const { children } = this.props;

    if (Array.isArray(children)) {
      return <map>{children}</map>
    }
    return children;
  }

  render() {
    const { width, height } = this.props;

    return (
      <div className="board" style={{ width: width, height: height }}>
        {this.renderChildren()}
      </div>
    );
  }
}
