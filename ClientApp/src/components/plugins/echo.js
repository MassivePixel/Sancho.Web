import React from 'react';

export default class EchoPlugin extends React.PureComponent {
  state = {
    text: '',
    messages: [],
  };

  componentDidMount() {
    this.props.connection.addListener('test', this._handleReceive);
  }

  componentWillUnmount() {
    this.props.connection.removeListener('test', this._handleReceive);
  }

  render() {
    return (
      <div className="plugin">
        <h3>Echo</h3>

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
    this.props.connection.send('test', 'chat', this.state.text);
    this.setState({ text: '' });
  };

  _handleReceive = message => {
    this._log(`got message: ${message.command}: '${message.data}'`);
  };

  _log = msg => {
    this.setState(s => ({
      messages: [msg, ...s.messages],
    }));
  };
}
