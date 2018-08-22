using Microsoft.AspNetCore.SignalR;

namespace Sancho.Web
{
    public class MessageMetadata
    {
        public string pluginId { get; set; }
        public string origin { get; set; }
        public string senderId { get; set; }
        public string messageId { get; set; }
    }

    /// <summary>
    /// Represents a message exchanged between server/client parts of a plugin.
    /// </summary>
    public class Message
    {
        public string command { get; set; }
        public object data { get; set; }

        public MessageMetadata metadata { get; set; }
    }

    public class ProtocolHub : Hub
    {
        public void Send(Message message)
        {
            Clients.Others.SendAsync("receive", message);
        }
    }
}
