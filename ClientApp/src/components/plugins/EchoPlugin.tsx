import React from 'react';
import {
  SanchoConnection,
  Message,
  ConnectionStatus,
} from '../../infrastructure/SanchoConnection';

type Props = {
  connection: SanchoConnection;
};

class State {
  text = '';
  messages: string[] = [];
  isEnabled = false;
}

export default class EchoPlugin extends React.PureComponent<Props, State> {
  state = new State();

  componentDidMount() {
    this.props.connection.addListener('test', this._handleReceive);
    this.props.connection.addStateChangedListener(this._handleStateChanged);
  }

  componentWillUnmount() {
    this.props.connection.removeListener('test', this._handleReceive);
    this.props.connection.removeStateChangedListener(this._handleStateChanged);
  }

  render() {
    const { text, isEnabled } = this.state;
    return (
      <div className="plugin">
        <h3>Echo</h3>

        <div>
          <input
            type="text"
            value={text}
            onChange={e => this.setState({ text: e.target.value })}
            disabled={!isEnabled}
          />
          <button onClick={this.send} disabled={!isEnabled}>
            send
          </button>
        </div>

        {this.state.messages.map((m, i) => <li key={i}>{m}</li>)}
      </div>
    );
  }

  send = () => {
    this.props.connection.send('test', 'chat', this.state.text);
    this.setState({ text: '' });
  };

  _handleReceive = (message: Message) => {
    this._log(`got message: ${message.command}: '${message.data}'`);
  };

  _handleStateChanged = (status: ConnectionStatus) => {
    this.setState({ isEnabled: status === ConnectionStatus.Connected });
  };

  _log = (msg: string) => {
    this.setState(s => ({
      messages: [msg, ...s.messages],
    }));
  };
}
