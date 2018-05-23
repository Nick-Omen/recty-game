import React from 'react';
import PropTypes from 'prop-types';

const FAULT_RATIO = 50;

const ARROWS_MAPPING = {
  37: 'left',
  38: 'top',
  39: 'right',
  40: 'bottom'
};
const WASD_MAPPING = {
  65: 'left',
  87: 'top',
  68: 'right',
  83: 'bottom'
};

export default class Controls extends React.Component {
  static propTypes = {
    onChangeDirection: PropTypes.func.isRequired
  };

  touchStartCoordinates = null;
  touchMoveCoordinates = null;

  constructor(props) {
    super(props);

    this.state = {
      controls: 'arrows',
    };

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

    const keyMapping = this.state.controls === 'arrows'
      ? ARROWS_MAPPING
      : WASD_MAPPING;

    this.props.onChangeDirection(keyMapping[keyCode]);
  }

  changeControls(controls) {
    this.setState({ controls: controls });
  }

  render() {

    if ('ontouchstart' in document.documentElement) {
      return (
        <div className="text-center">
          Swipe in direction to control the Recty.
        </div>
      );
    }

    if (this.state.controls === 'arrows') {
      return (
        <div className="text-center">
          Use <b>ARROWS</b> to control the Recty.
          <br/>
          <button onClick={this.changeControls.bind(this, 'wasd')}>Change controls to <b>WASD</b></button>
        </div>
      );
    } else if (this.state.controls === 'wasd') {
      return (
        <div className="text-center">
          Use <b>WASD</b> to control the Recty.
          <br/>
          <button onClick={this.changeControls.bind(this, 'arrows')}>Change controls to <b>ARROWS</b></button>
        </div>
      );
    }

    return null
  }
}
