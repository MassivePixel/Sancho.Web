using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Sancho.Web
{
    public class ProtocolHub : Hub
    {
        public const string ClientsGroup = nameof(ClientsGroup);
        public const string ServersGroup = nameof(ServersGroup);

        private readonly ILogger<ProtocolHub> _logger;

        public ProtocolHub(ILogger<ProtocolHub> logger)
        {
            _logger = logger;
        }

        public void Send(Message message)
        {
            switch (message.metadata?.origin)
            {
                case "server":
                    Clients.Group(ClientsGroup).SendAsync("receive", message);
                    break;

                case "client":
                    switch (message.command)
                    {
                        case "sancho:refresh":
                            NotifyServersWithClient();
                            break;

                        default:
                            Clients.Group(ServersGroup).SendAsync("receive", message);
                            break;
                    }
                    break;
            }
        }

        public override Task OnConnectedAsync()
        {
            base.OnConnectedAsync();

            var headers = this.Context.GetHttpContext()?.Request?.Headers;
            var clientType = (headers?["ClientType"] ?? "unknown").ToString();
            if (clientType.Equals("client", StringComparison.InvariantCultureIgnoreCase))
            {
                this.Groups.AddToGroupAsync(this.Context.ConnectionId, ClientsGroup);

                Clients.Group(ServersGroup).SendAsync("receive", new Message
                {
                    command = "sancho:connected",
                    metadata = new MessageMetadata
                    {
                        pluginId = "sancho",
                        origin = "sancho",
                        senderId = this.Context.ConnectionId
                    }
                });
            }
            else
            {
                this.Groups.AddToGroupAsync(this.Context.ConnectionId, ServersGroup);
                NotifyClientsNewServer();
            }

            _logger.LogDebug($"Connected {this.Context.ConnectionId} {clientType}");
            return Task.CompletedTask;
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            base.OnDisconnectedAsync(exception);

            _logger.LogDebug($"Disconnected {this.Context?.ConnectionId}, {exception}");

            var headers = this.Context.GetHttpContext()?.Request?.Headers;
            var clientType = (headers?["ClientType"] ?? "unknown").ToString();
            if (clientType.Equals("client", StringComparison.InvariantCultureIgnoreCase))
            {
                this.Groups.RemoveFromGroupAsync(this.Context.ConnectionId, ClientsGroup);

                Clients.Group(ServersGroup).SendAsync("receive", new Message
                {
                    command = "sancho:disconnected",
                    metadata = new MessageMetadata
                    {
                        pluginId = "sancho",
                        origin = "sancho",
                        senderId = this.Context.ConnectionId
                    }
                });
            }
            else
            {
                this.Groups.RemoveFromGroupAsync(this.Context.ConnectionId, ServersGroup);
            }

            return Task.CompletedTask;
        }

        private void NotifyClientsNewServer()
        {
            Clients.Group(ClientsGroup).SendAsync("receive", new Message
            {
                command = "sancho:connected",
                metadata = new MessageMetadata
                {
                    pluginId = "sancho",
                    origin = "sancho",
                    senderId = this.Context.ConnectionId
                }
            });
        }

        private void NotifyServersWithClient()
        {
            Clients.Group(ServersGroup).SendAsync("receive", new Message
            {
                command = "sancho:connected",
                metadata = new MessageMetadata
                {
                    pluginId = "sancho",
                    origin = "sancho",
                    senderId = this.Context.ConnectionId
                }
            });
        }
    }
}
