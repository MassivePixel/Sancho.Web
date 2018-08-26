import React, { Fragment } from 'react';
import EchoPlugin from './plugins/EchoPlugin';
import { SanchoConnection, Message } from '../infrastructure/SanchoConnection';
import AsyncCommand from './plugins/AsyncCommand';
import JintPlugin from './plugins/JintPlugin';

class State {
  isConnected = false;
  clients: string[] = [];
}

class Home extends React.Component<{}, State> {
  state = new State();
  connection = new SanchoConnection();

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    this.connection.removeListener('sancho', this.receive);
  }

  render() {
    const { isConnected, clients } = this.state;
    return (
      <div className="container">
        <nav>
          <h1>Sancho</h1>

          <div className="status">
            {isConnected ? 'Connected' : 'Connecting...'}{' '}
            <small>({clients.length} clients)</small>
          </div>

          {clients.map(c => (
            <Fragment key={c}>
              Client: <code>{c}</code>
              <EchoPlugin connectionId={c} connection={this.connection} />
              {/* <JintPlugin id={c} connection={this.connection} /> */}
              {/* <AsyncCommand id={c} connection={this.connection} /> */}
            </Fragment>
          ))}
        </nav>
      </div>
    );
  }

  connect = () => {
    this.connection.connect().then(() => {
      // connected
      this.setState({ isConnected: true });
      this.connection.addListener('sancho', this.receive);
    });
  };

  receive = (m: Message) => {
    switch (m.command) {
      case 'sancho:connected':
        this.setState((prevState: State) => {
          const { clients } = prevState;
          const connectionId = m.metadata.senderId;
          if (clients.indexOf(connectionId) === -1) {
            return {
              clients: [...clients, connectionId],
            };
          }
          return prevState;
        });
        break;

      case 'sancho:disconnected':
        this.setState(({ clients }) => ({
          clients: clients.filter(x => x !== m.metadata.senderId),
        }));
        break;
    }
  };
}
export default Home;
