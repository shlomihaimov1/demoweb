import { useState, useEffect, useRef } from "react";

// Components
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";

// Services
import { useChatStore } from "../../services/chatService";


const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser} = useChatStore();

  const authUserId: any = localStorage.getItem('_id');
  const messageEndRef = useRef<HTMLDivElement>(null);

  const getMessages = useChatStore((state) => state.getMessages);
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages);

  const [myProfileImage] = useState<string>((localStorage.getItem('profilePicture') || ''));
  
  // Get messages and subscribe to new messages
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  
  // Scroll to the bottom of the chat
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  // Format message time
  function formatMessageTime(date: string | number | Date): string {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message: any) => (
          <div
            key={message._id}
            id={message._id}
            className={`chat flex gap-4 ${message.senderId === authUserId ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div>

              {/* Message Sender */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  {message.senderId === authUserId ? (
                      <img
                        src={myProfileImage}
                        key={myProfileImage}
                        alt="me"
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    ) : (
                      <img
                        src={selectedUser?.profilePicture}
                        key={selectedUser?.profilePicture}
                        alt={selectedUser?.username}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    )  
                  }
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
            
            </div>
            
            {/* Message Content */}
            <div className="chat-bubble flex flex-col justify-center mb-7">
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
