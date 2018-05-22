import React from 'react';
import PropTypes from 'prop-types';

export default class Snake extends React.Component {
  static propTypes = {
    size: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
  };

  render() {
    const { data, size } = this.props;

    return data.map((c, i) => (
      <div key={i} className="snake-unit" style={{
        top: c[1],
        left: c[0],
        width: size,
        height: size,
        marginTop: -size/2,
        marginLeft: -size/2,
      }} />
    ));
  }
}
