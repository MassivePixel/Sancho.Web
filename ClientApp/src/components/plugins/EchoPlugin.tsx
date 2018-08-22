import React, { PureComponent } from 'react';

import { SanchoConnection, withSancho, Message } from '../../infrastructure';

type Props = {
  connection: SanchoConnection;
  isEnabled: boolean;
};

class State {
  text = '';
  messages: string[] = [];
  isEnabled = false;
}

class EchoPlugin extends PureComponent<Props, State> {
  state = new State();

  componentDidMount() {
    this.props.connection.addListener('echo', this.receive);
  }

  componentWillUnmount() {
    this.props.connection.removeListener('echo', this.receive);
  }

  render() {
    const { text } = this.state;
    const { isEnabled } = this.props;

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

        {this.state.messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </div>
    );
  }

  receive = (message: Message) => {
    this._log(`Echo: ${message.command}: '${message.data}'`);
  };

  send = () => {
    this.props.connection.send('echo', 'echo back', this.state.text);
    this.setState({ text: '' });
  };

  _log = (msg: string) => {
    this.setState(s => ({
      messages: [msg, ...s.messages],
    }));
  };
}

export default withSancho(EchoPlugin);
