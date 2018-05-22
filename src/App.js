import React from 'react';
import Board from './game/Board';
import Controls from './game/Controls';
import Snake from './game/Snake';
import Obstacles from './game/Obstacles';

const BOARD_WIDTH = 240;
const BOARD_HEIGHT = 360;
const SNAKE_SIZE = 10;
const GAME_SPEED = 100;

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateObstacle = function (direction) {
  const xRand = getRandomArbitrary(10, BOARD_WIDTH / 5 - 1) * 5;
  const yRand = getRandomArbitrary(10, BOARD_WIDTH / 5 - 1) * 5;
  switch (direction) {
    case 'right':
      return [SNAKE_SIZE / 2, yRand, 'right'];
    case 'bottom':
      return [xRand, SNAKE_SIZE / 2, 'bottom'];
    case 'left':
      return [BOARD_WIDTH - (SNAKE_SIZE / 2), yRand, 'left'];
    case 'top':
      return [xRand, BOARD_HEIGHT - (SNAKE_SIZE / 2), 'top'];
    default:
      throw new Error('Wrong direction! ' + direction);
  }
};

class App extends React.Component {
  initialState = {
    direction: null,
    gameOver: false,
    snake: [[BOARD_WIDTH / 2, BOARD_HEIGHT / 2]],
    obstacles: [],
    score: 0
  };

  interval = null;
  state = Object.assign({}, this.initialState);

  onChangeDirection(direction) {
    if (direction === 'another') {
      return false;
    }

    const obstacle = generateObstacle(direction);

    this.setState({
      direction: direction,
      score: this.state.score + 1,
      obstacles: [...this.state.obstacles, obstacle]
    });
  }

  moveGame(direction) {
    let x, y;
    const obstacles = this.state.obstacles.map(u => {
      let dir = u[2];
      switch (u[2]) {
        case 'right':
          x = u[0] + SNAKE_SIZE;
          if (x > BOARD_WIDTH) {
            dir = null;
          }
          return [x, u[1], dir];
        case 'bottom':
          y = u[1] + SNAKE_SIZE;
          if (y > BOARD_HEIGHT) {
            dir = null;
          }
          return [u[0], y, dir];
        case 'left':
          x = u[0] - SNAKE_SIZE;
          if (x < 0) {
            dir = null;
          }
          return [x, u[1], dir];
        case 'top':
          y = u[1] - SNAKE_SIZE;
          if (y < 0) {
            dir = null;
          }
          return [u[0], y, dir];
        default:
          throw new Error('Wrong direction! ' + direction);
      }
    }).filter(u => u[2] !== null);

    let isGameOver = obstacles.reduce((isGO, c) => {
      return isGO || (Math.abs(c[0] - this.state.snake[0][0]) < SNAKE_SIZE
        && Math.abs(c[1] - this.state.snake[0][1]) < SNAKE_SIZE);
    }, false);

    const snake = this.state.snake.map(u => {
      switch (direction) {
        case 'right':
          x = u[0] + SNAKE_SIZE;
          if (x > BOARD_WIDTH) {
            isGameOver = true;
          }
          return [x, u[1]];
        case 'bottom':
          y = u[1] + SNAKE_SIZE;
          if (y > BOARD_HEIGHT) {
            isGameOver = true;
          }
          return [u[0], y];
        case 'left':
          x = u[0] - SNAKE_SIZE;
          if (x < 0) {
            isGameOver = true;
          }
          return [x, u[1]];
        case 'top':
          y = u[1] - SNAKE_SIZE;
          if (y < 0) {
            isGameOver = true;
          }
          return [u[0], y];
        default:
          throw new Error('Wrong direction! ' + direction);
      }
    });

    this.setState({
      snake: snake,
      gameOver: isGameOver,
      obstacles: obstacles
    });
  }

  resetGame() {
    this.setState(Object.assign({}, this.initialState));
  }

  render() {
    if (this.state.gameOver) {
      clearInterval(this.interval);
      this.interval = null;
      return (
        <div className="container">
          Game Over
          <br />
          Your score is {this.state.score}
          <button onClick={this.resetGame.bind(this)}>Reset</button>
        </div>
      );
    }


    if (this.state.direction !== null && this.interval === null) {
      this.interval = setInterval(() => {
        this.moveGame(this.state.direction);
      }, GAME_SPEED);
    }

    return (
      <div className="container">
        <h1 className="title">Beware of Black</h1>
        <h2 className="subtitle">The Game</h2>
        <Board width={BOARD_WIDTH}
               height={BOARD_HEIGHT}>
          <span className="score">
            Score:
            <br />
            <span className="score-number">{this.state.score}</span>
          </span>
          <Snake data={this.state.snake} size={SNAKE_SIZE} />
          <Obstacles data={this.state.obstacles} size={SNAKE_SIZE} />
        </Board>
        <Controls onChangeDirection={this.onChangeDirection.bind(this)} />
      </div>
    );
  }
}

export default App;
