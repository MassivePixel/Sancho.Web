import React, { PureComponent } from 'react';
import { SanchoConnection } from '../../infrastructure/SanchoConnection';

type Props = {
  connection: SanchoConnection;
};

class State {
  counter = 1;
  answer = '';
}

export default class AsyncCommand extends PureComponent<Props, State> {
  state = new State();

  render() {
    const { counter, answer } = this.state;

    return (
      <div className="plugin">
        <h3>Async command</h3>
        <p>Counter: {counter}</p>
        <button onClick={this.call}>Call</button>
        <p>Answer: {answer}</p>
      </div>
    );
  }

  call = () => {
    this.props.connection
      .sendQuery('test.async', 'exec', this.state.counter)
      .then(r => {
        this.setState({ answer: r.command });
      });
    this.setState(s => ({ counter: s.counter + 1 }));
  };
}
