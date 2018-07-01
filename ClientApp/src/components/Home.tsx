import React from 'react';
import EchoPlugin from './plugins/EchoPlugin';
import { SanchoConnection } from '../infrastructure/SanchoConnection';

class Home extends React.Component {
  connection = new SanchoConnection();

  componentDidMount() {
    this.connect();
  }

  render() {
    return (
      <div className="container">
        <nav>
          <h1>Sancho</h1>
        </nav>

        <EchoPlugin connection={this.connection} />
      </div>
    );
  }

  connect = () => {
    this.connection.connect().then(() => {
      // connected
    });
  };
}
export default Home;
