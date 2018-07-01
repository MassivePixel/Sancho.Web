import React from 'react';
import EchoPlugin from './plugins/echo';
import { sanchoConnection } from '../infrastructure/sanchoConnection';

class Home extends React.Component {
  connection = new sanchoConnection();

  componentDidMount() {
    this.connect();
  }

  render() {
    return (
      <div className="container">
        <h1>SignalR</h1>

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
