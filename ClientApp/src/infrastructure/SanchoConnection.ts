import * as signalR from '@aspnet/signalr';

export type Message = {
  command: string;
  data: null | object;
  metadata: {
    pluginId: string;
    origin: 'server' | 'client';
    messageId?: string;
    senderId: string;
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

  queries = new Map<string, (m: Message) => any>();

  stateChangedListeners: ((status: ConnectionStatus) => void)[] = [];
  messageListeners = new Map<string, ((m: Message) => any)[]>();

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/protocol')
      .build();
    this.id = '1';
    this.isConnected = false;
    this.connection.on('receive', this.handleReceive);
  }

  connect = () => {
    const t = this.connection.start();
    t.then(() => {
      this.isConnected = true;
      this.stateChangedListeners.forEach(f => f(ConnectionStatus.Connected));
    });
    return t;
  };

  send = (pluginId: string, command: string, data: any | null = null) => {
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

  sendQuery = (pluginId: string, command: string, data: any | null = null) =>
    new Promise<Message>((resolve: (m: Message) => any) => {
      const messageId = getNextMessageId();
      const m: Message = {
        command,
        data,
        metadata: {
          pluginId,
          messageId,
          origin: 'server',
          senderId: this.id,
        },
      };
      this.connection.send('send', m);

      this.queries.set(messageId, resolve);
    });

  addStateChangedListener(callback: (status: ConnectionStatus) => void) {
    this.stateChangedListeners.push(callback);
  }

  removeStateChangedListener(callback: (status: ConnectionStatus) => void) {
    const index = this.stateChangedListeners.indexOf(callback);
    if (index !== -1) {
      this.stateChangedListeners.splice(index);
    }
  }

  addListener = (pluginId: string, callback: (m: Message) => any) => {
    if (!this.messageListeners.has(pluginId)) {
      this.messageListeners.set(pluginId, []);
    }

    this.messageListeners.get(pluginId)!.push(callback);
  };

  removeListener = (pluginId: string, callback: (m: Message) => any) => {
    if (!this.messageListeners.has(pluginId)) {
      return;
    }

    const plugins = this.messageListeners.get(pluginId);
    const index = plugins!.indexOf(callback);
    if (index !== -1) {
      plugins!.splice(index);
    }
  };

  handleReceive = (message: Message) => {
    const listeners = this.messageListeners.get(message.metadata.pluginId);

    console.dir(message);

    // resolve queries
    if (message.metadata.messageId && message.metadata.origin !== 'server') {
      const query = this.queries.get(message.metadata.messageId);
      if (query) {
        query(message);
        this.queries.delete(message.metadata.messageId);
      }
    }

    if (listeners && listeners.length) {
      listeners.forEach(listener => listener(message));
      return true;
    }

    return false;
  };
}

// rough implementation
let messageId = 1;

function getNextMessageId() {
  // tslint:disable-next-line:no-increment-decrement
  return (messageId++).toString();
}
