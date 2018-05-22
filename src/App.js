import React from 'react';
import Board from './game/Board';
import Controls from './game/Controls';
import Snake from './game/Snake';
import Obstacles from './game/Obstacles';

const boardWidth = 240;
const boardHeight = 360;
const snakeSize = 10;

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateObstacle = function (direction) {
  const xRand = getRandomArbitrary(10, boardWidth / 5 - 1) * 5;
  const yRand = getRandomArbitrary(10, boardWidth / 5 - 1) * 5;
  switch (direction) {
    case 'right':
      return [snakeSize / 2, yRand, 'right'];
    case 'bottom':
      return [xRand, snakeSize / 2, 'bottom'];
    case 'left':
      return [boardWidth - (snakeSize / 2), yRand, 'left'];
    case 'top':
      return [xRand, boardHeight - (snakeSize / 2), 'top'];
    default:
      throw new Error('Wrong direction! ' + direction);
  }
};

class App extends React.Component {
  state = {
    direction: null,
    gameOver: false,
    snake: [[snakeSize / 2, snakeSize / 2]],
    obstacles: [],
  };

  onChangeDirection(direction) {
    if (direction === 'start') {
      // Prevent change direction when game is in progress.
      if (this.state.direction !== null) {
        return false;
      }

      direction = 'right';
    }

    const obstacle = generateObstacle(direction);

    console.log(obstacle);
    this.setState({
      direction: direction,
      obstacles: [...this.state.obstacles, obstacle]
    });
  }

  moveGame(direction) {
    let isGameOver = false;
    let x, y;
    const obstacles = this.state.obstacles.map(u => {
      let dir = u[2];
      switch (u[2]) {
        case 'right':
          x = u[0] + snakeSize;
          if (x > boardWidth) {
            dir = null;
          }
          return [x, u[1], dir];
        case 'bottom':
          y = u[1] + snakeSize;
          if (y > boardHeight) {
            dir = null;
          }
          return [u[0], y, dir];
        case 'left':
          x = u[0] - snakeSize;
          if (x < 0) {
            dir = null;
          }
          return [x, u[1], dir];
        case 'top':
          y = u[1] - snakeSize;
          if (y < 0) {
            dir = null;
          }
          return [u[0], y, dir];
        default:
          throw new Error('Wrong direction! ' + direction);
      }
    }).filter(u => u[2] !== null);
    const snake = this.state.snake.map(u => {
      switch (direction) {
        case 'right':
          x = u[0] + snakeSize;
          if (x > boardWidth) {
            isGameOver = true;
          }
          return [x, u[1]];
        case 'bottom':
          y = u[1] + snakeSize;
          if (y > boardHeight) {
            isGameOver = true;
          }
          return [u[0], y];
        case 'left':
          x = u[0] - snakeSize;
          if (x < 0) {
            isGameOver = true;
          }
          return [x, u[1]];
        case 'top':
          y = u[1] - snakeSize;
          if (y < 0) {
            isGameOver = true;
          }
          return [u[0], y];
        default:
          throw new Error('Wrong direction! ' + direction);
      }
    });

    if (!isGameOver) {
      isGameOver = obstacles.reduce((isGO, c) => isGO || (c[0] === snake[0][0] && c[1] === snake[0][1]), false);
    }

    this.setState({
      snake: snake,
      gameOver: isGameOver,
      obstacles: obstacles
    });
  }

  render() {
    if (this.state.gameOver) {
      return (
        <div className="container">
          Game Over
        </div>
      );
    }
    return (
      <div className="container">
        <Board direction={this.state.direction}
               width={boardWidth}
               height={boardHeight}
               moveSnake={this.moveGame.bind(this)}>
          <Snake data={this.state.snake} size={snakeSize} />
          <Obstacles data={this.state.obstacles} size={snakeSize} />
        </Board>
        <Controls onChangeDirection={this.onChangeDirection.bind(this)} />
      </div>
    );
  }
}

export default App;
