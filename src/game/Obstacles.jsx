import React from 'react';
import PropTypes from 'prop-types';

export default class Obstacles extends React.Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.drawObstacles = this.drawObstacles.bind(this);

    setTimeout(() => {
      this.drawObstacles();
    }, 0);
  }

  animationFrameId = null;

  drawObstacles() {
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
    ctx.fillStyle = 'black';
    ctx.save();
    data.forEach(d => {
      if (typeof(Path2D) === 'object') {
        const circle = new Path2D();
        circle.moveTo(d[0] - halfSize, d[1] - halfSize);
        circle.arc(d[0] - halfSize, d[1] - halfSize, halfSize, 0, 2 * Math.PI);
        ctx.fill(circle);
      } else {
        ctx.beginPath();
        ctx.arc(d[0] - halfSize, d[1] - halfSize, halfSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    ctx.restore();
    this.animationFrameId = window.requestAnimationFrame(this.drawObstacles)
  }

  render() {
    const { width, height } = this.props;

    return <canvas ref="canvas" width={width} height={height} className="canvas" />;
  }
}
