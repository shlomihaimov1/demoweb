import { Link } from 'react-router-dom';

// Icons
import { X } from "lucide-react";

// Services
import { useAuthStore } from "../../services/authService";
import { useChatStore } from "../../services/chatService";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">

          {/* Profile Picture */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <Link to={`/profile/${selectedUser?._id}`}>
                <img
                  src={selectedUser?.profilePicture}
                  key={selectedUser?.profilePicture}
                  alt={selectedUser?.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
              </Link>
            </div>
          </div>

          {/* User info */}
          {selectedUser && (
            <div>
              
              <Link to={`/profile/${selectedUser?._id}`}>
                <h3 className="font-medium">{selectedUser?.username}</h3>
              </Link>

              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
            </div>
          )}
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
