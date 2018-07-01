import React from 'react';
import * as signalR from '@aspnet/signalr';

class Home extends React.Component {
  state = {
    text: '',
    messages: [],
  };

  componentDidMount() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/protocol')
      .build();

    this.connection.on('receive', message => {
      this.prependMessage(`got message: ${message.command}: '${message.data}'`);
    });

    this.prependMessage('connecting...');

    this.connection.start().then(() => {
      this.prependMessage('connection started');
      this.connection.send('send', {
        command: 'server test!',
        data: 'test!',
        metadata: {
          pluginId: 'test',
          origin: 'server',
          senderId: 0,
        },
      });
    });
  }

  prependMessage = msg => {
    this.setState(s => ({
      messages: [msg, ...s.messages],
    }));
  };

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
      </div>
    );
  }

  send = () => {
    this.connection.send('send', {
      command: 'chat',
      data: this.state.text,
      metadata: {
        pluginId: 'test',
        origin: 'server',
        senderId: 0,
      },
    });
    this.setState({ text: '' });
  };
}
export default Home;
