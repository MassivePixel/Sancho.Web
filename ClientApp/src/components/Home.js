import React from 'react';
import EchoPlugin from './plugins/echo';
import { sanchoConnection } from '../infrastructure/sanchoConnection';

class Home extends React.Component {
  state = {
    text: '',
    messages: [],
  };

  connection = new sanchoConnection();

  componentDidMount() {
    this.connect();
  }

  render() {
    return (
      <div className="container">
        <h1>SignalR</h1>

        <div>
          <input
            type="text"
            value={this.state.text}
            onChange={e => this.setState({ text: e.target.value })}
          />
          <button onClick={this.send}>send</button>
        </div>

        {this.state.messages.map((m, i) => <li key={i}>{m}</li>)}

        <EchoPlugin connection={this.connection} />
      </div>
    );
  }

  connect = () => {
    this.connection.addListener('test', message => {
      this.log(`got message: ${message.command}: '${message.data}'`);
    });

    this.log('connecting...');

    this.connection.connect().then(() => {
      this.log('connection started');
      this.connection.send('test', 'server test!', 'test!');
    });
  };

  send = () => {
    this.connection.send('test', 'chat', this.state.text);
    this.setState({ text: '' });
  };

  log = msg => {
    this.setState(s => ({
      messages: [msg, ...s.messages],
    }));
  };
}
export default Home;
