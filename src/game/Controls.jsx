import React from 'react';
import PropTypes from 'prop-types';

export default class Controls extends React.Component {
  static propTypes = {
    onChangeDirection: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
  }

  onKeyDown(e) {
    const { keyCode } = e;

    switch (keyCode) {
      case 37:
        return this.props.onChangeDirection('left');
      case 38:
        return this.props.onChangeDirection('top');
      case 39:
        return this.props.onChangeDirection('right');
      case 40:
        return this.props.onChangeDirection('bottom');
      default:
        return this.props.onChangeDirection('start');
    }
  }

  render() {

    return (
      <div>
        Use arrows to control the rectangle.
      </div>
    );
  }
}
