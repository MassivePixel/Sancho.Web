import React from 'react';
import { SanchoConnection, ConnectionStatus } from './SanchoConnection';

type Props = {
  connection: SanchoConnection;
};

class State {
  connectionStatus = ConnectionStatus.Disconnected;
}

export function withSancho<T>(Component: any) {
  return class extends React.Component<Props & T, State> {
    state = new State();

    componentDidMount() {
      this.props.connection.addStateChangedListener(this.handleStateChanged);
      if (this.props.connection.isConnected) {
        this.setState({ connectionStatus: ConnectionStatus.Connected });
      }
    }

    componentWillUnmount() {
      this.props.connection.removeStateChangedListener(this.handleStateChanged);
    }

    render() {
      const { connectionStatus } = this.state;
      return (
        <Component
          {...this.props}
          isEnabled={connectionStatus === ConnectionStatus.Connected}
        />
      );
    }

    handleStateChanged = (connectionStatus: ConnectionStatus) =>
      this.setState({ connectionStatus });
  };
}
