import './ChatPanel.css'
import chatboxIcon from '../../assets/icons/chatbox.svg'

const ChatPanel = () => {
  return (
    <aside className="w-[52px] h-full flex flex-col gap-[10px] py-[18px] px-[13px] rounded-r-lg chat-panel-bg">
      <button
        onClick={() => alert('chat')}
        className="p-1 bg-white rounded-lg flex items-center justify-center"
      >
        <img src={chatboxIcon} alt="Chat" className="w-[22px] h-[22px]" />
      </button>
    </aside>
  )
}

export default ChatPanel
