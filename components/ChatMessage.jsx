import "../styles/chatMessage.css"

const ChatMessage = ({ message }) => {
  // Clean up content if it contains chart data
  let content = message.content
  if (content.includes("CHART_DATA:")) {
    content = content.split("CHART_DATA:")[0]
  }

  return (
    <div className={`message-container ${message.role === "user" ? "user-message" : "assistant-message"}`}>
      <div className={`avatar ${message.role === "user" ? "user-avatar" : "assistant-avatar"}`}>
        {message.role === "user" ? "👤" : "🤖"}
      </div>
      <div className={`message-bubble ${message.role === "user" ? "user-bubble" : "assistant-bubble"}`}>
        <div className="message-content">{content}</div>
      </div>
    </div>
  )
}

export default ChatMessage
