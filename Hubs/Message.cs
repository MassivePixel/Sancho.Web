namespace Sancho.Web
{
    /// <summary>
    /// Represents a message exchanged between server/client parts of a plugin.
    /// </summary>
    public class Message
    {
        public string command { get; set; }
        public object data { get; set; }

        public MessageMetadata metadata { get; set; }
    }
}
