import React from 'react';
import Board from './game/Board';
import Controls from './game/Controls';
import Snake from './game/Snake';
import Obstacles from './game/Obstacles';

const BOARD_WIDTH = 240;
const BOARD_HEIGHT = 360;
const SNAKE_SIZE = 10;
const SNAKE_HALF_SIZE = 5;
const GAME_SPEED = 100;
const LEVEL_SCORE_COUNT = 25;

// const getPossibilitiesObject = range => Array.from(new Array(range / SNAKE_HALF_SIZE - 1))
//   .reduce((o, v, i) => {
//     o[(i + 1) * 5] = 0;
//     return o;
//   }, {});
// const xPossibilities = getPossibilitiesObject(BOARD_WIDTH);
// const yPossibilities = getPossibilitiesObject(BOARD_HEIGHT);

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getObstacle = function (direction) {
  const xRand = getRandomArbitrary(0, BOARD_WIDTH / SNAKE_HALF_SIZE - 1) * SNAKE_HALF_SIZE;
  const yRand = getRandomArbitrary(0, BOARD_HEIGHT / SNAKE_HALF_SIZE - 1) * SNAKE_HALF_SIZE;

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

const directionMapping = {
  right: 'bottom',
  bottom: 'left',
  left: 'top',
  top: 'right'
};

const generateObstacles = function (direction, count) {
  const obstacles = [];

  for (let i = 0; i < count; i++) {
    obstacles.push(getObstacle(direction));
    direction = directionMapping[direction];
  }
  return obstacles;
};

class App extends React.Component {
  initialState = {
    direction: null,
    gameOver: false,
    snake: [[BOARD_WIDTH / 2, BOARD_HEIGHT / 2]],
    obstacles: [],
    level: 0,
    score: -1
  };

  interval = null;
  state = Object.assign({}, this.initialState);

  onChangeDirection(direction) {
    if (direction === 'another' || direction === this.state.direction) {
      return false;
    }

    const obstacles = generateObstacles(direction, this.state.level + 1);

    console.log(obstacles);

    const level = Math.round(this.state.score / LEVEL_SCORE_COUNT);

    this.setState({
      direction: direction,
      score: this.state.score + 1,
      level: level,
      obstacles: [...this.state.obstacles, ...obstacles]
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
        <h1 className="title">Evade, Recty, Evade</h1>
        <h2 className="subtitle">The Game</h2>
        <Board width={BOARD_WIDTH}
               height={BOARD_HEIGHT}>
          {this.state.direction !== null ? (
            <span>
              <span className="score">
                Score:
                <br />
                <span className="score-number">{this.state.score}</span>
              </span>
              <span className="score level">
                Level:
                <br />
                <span className="score-number">{this.state.level}</span>
              </span>
            </span>
          ) : null}
          <Snake data={this.state.snake} size={SNAKE_SIZE} />
          <Obstacles data={this.state.obstacles} size={SNAKE_SIZE} />
        </Board>
        <Controls onChangeDirection={this.onChangeDirection.bind(this)} />
      </div>
    );
  }
}

export default App;
