import React, { PureComponent } from 'react';

import { SanchoConnection } from '../../infrastructure/SanchoConnection';

type Props = {
  connection: SanchoConnection;
};

class State {
  command = '';
  log: string[] = [];
}

export default class JintPlugin extends PureComponent<Props, State> {
  state = new State();

  render() {
    const { command, log } = this.state;
    return (
      <div className="plugin">
        <h3>Jint</h3>
        <div>
          <form onSubmit={this.execute}>
            <label htmlFor="command">Command</label>
            <input
              type="text"
              name="command"
              value={command}
              onChange={e => this.setState({ command: e.target.value })}
              style={{ width: '100%', fontFamily: 'monospace' }}
            />
            <button onClick={this.execute}>Execute</button>
          </form>
          <span>log:</span>
          <ul>
            {log.map(x => (
              <li>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  execute = (e: any) => {
    e.preventDefault();

    this.props.connection
      .sendQuery('jint', 'execute', this.state.command)
      .then(({ data }) => {
        if (data) {
          this.setState(prevState => ({
            log: [
              typeof data === 'string'
                ? data
                : data
                  ? JSON.stringify(data)
                  : 'unknown data',
              ...prevState.log,
            ],
          }));
        }
      });
    this.setState(s => ({ command: '' }));
  };
}
