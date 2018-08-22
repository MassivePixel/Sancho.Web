import React from 'react';
import { SanchoConnection, ConnectionStatus } from './SanchoConnection';

type Props = {
  connection: SanchoConnection;
};

class State {
  connectionStatus = ConnectionStatus.Disconnected;
}

export const withSancho = (Component: any) => {
  return class extends React.Component<Props, State> {
    state = new State();

    componentDidMount() {
      this.props.connection.addStateChangedListener(this.handleStateChanged);
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
};
