import * as signalR from '@aspnet/signalr';

export type Message = {
  command: string;
  data: null | object;
  metadata: {
    pluginId: string;
    origin: 'server' | 'client';
  };
};

export enum ConnectionStatus {
  Disconnected,
  Connected,
}

export class SanchoConnection {
  connection: signalR.HubConnection;
  id: string;
  isConnected: boolean;

  stateChangedListeners: ((status: ConnectionStatus) => void)[] = [];
  messageListeners = new Map<string, ((m: Message) => any)[]>();

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/protocol')
      .build();
    this.id = '1';
    this.isConnected = false;
    this.connection.on('receive', this._handleReceive);
  }

  connect = () => {
    const t = this.connection.start();
    t.then(() => {
      this.isConnected = true;
      this.stateChangedListeners.forEach(f => f(ConnectionStatus.Connected));
    });
    return t;
  };

  send = (
    pluginId: string,
    command: string,
    data: null | object | string = null
  ) => {
    this.connection.send('send', <Message>{
      command,
      data,
      metadata: {
        pluginId,
        origin: 'server',
        senderId: this.id,
      },
    });
  };

  addStateChangedListener(callback: (status: ConnectionStatus) => void) {
    this.stateChangedListeners.push(callback);
  }

  removeStateChangedListener(callback: (status: ConnectionStatus) => void) {}

  addListener = (pluginId: string, callback: (m: Message) => any) => {
    if (!this.messageListeners.has(pluginId)) {
      this.messageListeners.set(pluginId, []);
    }

    this.messageListeners.get(pluginId)!.push(callback);
  };

  removeListener = (pluginId: string, callback: (m: Message) => any) => {};

  _handleReceive = (message: Message) => {
    const listeners = this.messageListeners.get(message.metadata.pluginId);

    if (listeners && listeners.length) {
      listeners.forEach(listener => listener(message));
      return true;
    }
    return false;
  };
}
