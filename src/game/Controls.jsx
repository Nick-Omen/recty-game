import React from 'react';
import PropTypes from 'prop-types';

const FAULT_RATIO = 50;

export default class Controls extends React.Component {
  static propTypes = {
    onChangeDirection: PropTypes.func.isRequired
  };

  touchStartCoordinates = null;
  touchMoveCoordinates = null;

  constructor(props) {
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    document.addEventListener('keydown', this.onKeyDown);

    document.addEventListener('touchstart', this.onTouchStart);
    document.addEventListener('touchmove', this.onTouchMove);
    document.addEventListener('touchend', this.onTouchEnd);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);

    document.removeEventListener('touchstart', this.onTouchStart);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  }

  onTouchStart(e) {
    this.touchStartCoordinates = e['touches'][0];
  }

  onTouchMove(e) {
    this.touchMoveCoordinates = e['touches'][0];
  }

  onTouchEnd() {
    if (this.touchStartCoordinates !== null && this.touchMoveCoordinates !== null) {
      if (
        this.touchStartCoordinates.screenX - this.touchMoveCoordinates.screenX > 0
        && Math.abs(this.touchStartCoordinates.screenY - this.touchMoveCoordinates.screenY) < FAULT_RATIO
      ) {
        this.props.onChangeDirection('left');
      } else if (
        this.touchStartCoordinates.screenX - this.touchMoveCoordinates.screenX < 0
        && Math.abs(this.touchStartCoordinates.screenY - this.touchMoveCoordinates.screenY) < FAULT_RATIO
      ) {
        this.props.onChangeDirection('right');
      } else if (
        this.touchStartCoordinates.screenY - this.touchMoveCoordinates.screenY > 0
        && Math.abs(this.touchStartCoordinates.screenX - this.touchMoveCoordinates.screenX) < FAULT_RATIO
      ) {
        this.props.onChangeDirection('top');
      } else if (
        this.touchStartCoordinates.screenY - this.touchMoveCoordinates.screenY < 0
        && Math.abs(this.touchStartCoordinates.screenX - this.touchMoveCoordinates.screenX) < FAULT_RATIO
      ) {
        this.props.onChangeDirection('bottom');
      }
    }

    this.touchStartCoordinates = null;
    this.touchMoveCoordinates = null;
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
        return this.props.onChangeDirection('another');
    }
  }

  render() {

    if ('ontouchstart' in document.documentElement) {
      return (
        <div className="text-center">
          Swipe in direction.
        </div>
      );
    }

    return (
      <div className="text-center">
        Use arrows to control the rectangle.
      </div>
    );
  }
}
