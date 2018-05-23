import React from 'react';
import PropTypes from 'prop-types';

export default class Snake extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
  };

  animationFrameId = null;

  constructor(props) {
    super(props);

    this.drawSnake = this.drawSnake.bind(this);

    setTimeout(() => {
      this.drawSnake();
    }, 0);
  }

  drawSnake() {
    const { canvas } = this.refs;
    if (!canvas) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      return;
    }
    const { data, size, width, height } = this.props;
    const halfSize = size / 2;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'red';
    ctx.save();
    data.forEach(d => {
      ctx.fillRect(d[0] - halfSize, d[1] - halfSize, size, size);
    });
    ctx.restore();

    this.animationFrameId = window.requestAnimationFrame(this.drawSnake);
  }

  render() {
    const { width, height } = this.props;

    return <canvas ref="canvas" width={width} height={height} className="canvas" />;
  }
}
