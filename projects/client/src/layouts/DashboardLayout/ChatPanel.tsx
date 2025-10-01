import './ChatPanel.css'
import chatboxIcon from '@/assets/icons/chatbox.svg'
import { Button } from '@heroui/button'

const ChatPanel = () => {
  return (
    <aside className="w-[52px] h-full flex flex-col gap-[10px] py-2 items-center rounded-r-lg chat-panel-bg">
      <Button isIconOnly variant="flat" radius="full" onPress={() => alert('chat')}>
        <img src={chatboxIcon} alt="Chat" className="w-[22px] h-[22px]" />
      </Button>
    </aside>
  )
}

export default ChatPanel
