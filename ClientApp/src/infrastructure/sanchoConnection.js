import * as signalR from '@aspnet/signalr';

export class sanchoConnection {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/protocol')
      .build();
    this.id = '1';
    this.isConnected = false;
    this.listeners = new Map();
    this.connection.on('receive', this._handleReceive);
  }

  connect = () => {
    const t = this.connection.start();
    t.then(() => {
      this.isConnected = true;
    });
    return t;
  };

  send = (pluginId, command, data = null) => {
    this.connection.send('send', {
      command,
      data,
      metadata: {
        pluginId,
        origin: 'server',
        senderId: this.id,
      },
    });
  };

  addListener = (pluginId, callback) => {
    if (!this.listeners.has(pluginId)) {
      this.listeners.set(pluginId, []);
    }

    this.listeners.get(pluginId).push(callback);
  };

  _handleReceive = message => {
    const listeners = this.listeners.get(message.metadata.pluginId);

    if (listeners && listeners.length) {
      listeners.forEach(listener => listener(message));
      return true;
    }
    return false;
  };
}
