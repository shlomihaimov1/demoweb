import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

// Services
import { useChatStore } from "../../services/chatService";
import { useAuthStore } from "../../services/authService";

// Components
import SidebarSkeleton from "../skeletons/SidebarSkeleton";

// Icons
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, connectSocket } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  // Select specifc user from params ?id=IDOFUSER
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");
    
    if (userId) {
      console.log(userId);
      console.log(document.getElementById(userId))
      document.getElementById(userId)?.click();
    }
  }, [filteredUsers]);


  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">

        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        
        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
        
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />

            <span className="text-sm">Show online only</span>
          </label>
        
          <span className="text-xs text-zinc-500">({onlineUsers.length - 2} online)</span>
        
        </div>
      
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            id={user._id}
            onClick={() => setSelectedUser(user)}
            className={` px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 w-[95%] mx-[2.5%]
              p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >

            {/* User info - only visible on larger screens */}
            <div className="text-left min-w-0 flex gap-2">
              
              <div className="hidden lg:block relative mx-auto lg:mx-0 w-[25px]">
                  {onlineUsers.includes(user._id) ? (
                    <span
                      className="absolute bottom-0 right-0 size-3 bg-green-500 
                      rounded-full ring-2 ring-zinc-900 top-1/3"
                    />
                  ) : (
                    <span
                      className="absolute bottom-0 right-0 size-3 bg-zinc-500 
                      rounded-full ring-2 ring-zinc-900 top-1/3"
                    />
                  )}
              </div>

              <Link to={`/profile/${user?._id}`}>
                <img
                  src={user?.profilePicture}
                  key={user?.profilePicture}
                  alt={user?.username}
                  className="w-10 h-10 rounded-full"
                />
              </Link>

              <div className="hidden lg:block font-medium truncate my-auto">{user.username}</div>
              
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
