import React from 'react';
import EchoPlugin from './plugins/EchoPlugin';
import { SanchoConnection } from '../infrastructure/SanchoConnection';
import AsyncCommand from './plugins/AsyncCommand';
import JintPlugin from './plugins/JintPlugin';

class State {
  isConnected = false;
}

class Home extends React.Component<{}, State> {
  state = new State();
  connection = new SanchoConnection();

  componentDidMount() {
    this.connect();
  }

  render() {
    const { isConnected } = this.state;
    return (
      <div className="container">
        <nav>
          <h1>Sancho</h1>

          <div className="status">
            {isConnected ? 'Connected' : 'Connecting...'}
          </div>
        </nav>

        <EchoPlugin connection={this.connection} />
        <JintPlugin connection={this.connection} />
        <AsyncCommand connection={this.connection} />
      </div>
    );
  }

  connect = () => {
    this.connection.connect().then(() => {
      // connected
      this.setState({ isConnected: true });
    });
  };
}
export default Home;
