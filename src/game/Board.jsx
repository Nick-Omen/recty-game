import React from 'react';
import PropTypes from 'prop-types';

export default class Board extends React.Component {
  static propTypes = {
    direction: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    speed: PropTypes.number,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]).isRequired,
    moveSnake: PropTypes.func.isRequired,
  };

  static defaultProps = {
    speed: 100
  };

  state = {
    direction: null
  };

  interval = null;

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      direction: nextProps.direction
    };
  }

  renderChildren() {
    const { children } = this.props;

    if (Array.isArray(children)) {
      return <map>{children}</map>
    }
    return children;
  }

  render() {
    const { direction, speed, width, height } = this.props;

    if (direction !== null && this.interval === null) {
      this.interval = setInterval(() => {
        this.props.moveSnake(this.state.direction);
      }, speed);
    }

    return (
      <div className="board" style={{ width: width, height: height }}>
        {direction === null ? (
          <span className="board-message">Press any key to start.</span>
        ) : this.renderChildren()}
      </div>
    );
  }
}
