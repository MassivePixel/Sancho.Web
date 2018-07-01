import React from 'react';
import EchoPlugin from './plugins/echo';
import { SanchoConnection } from '../infrastructure/SanchoConnection';

class Home extends React.Component {
  connection = new SanchoConnection();

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
