import { SendHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  allregisterUsers,
  userGetChats,
} from "../services/adminAuth/loginAuth";
import io from "socket.io-client";
import { BASEURL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

const socket = io(BASEURL);

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const { _id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await allregisterUsers();
        setUsers(res.data.filter((user) => user.name !== "Admin"));
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on("recived message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  const userId = "6867d14773c3c0b10331d8c6";
  const targetId = selectedUser;

  useEffect(() => {
    if (userId && targetId) {
      socket.emit("join room", { userId, targetId });
    }
  }, [userId, targetId]);

  const handleMessage = () => {
    if (input.trimStart()) {
      const userId = "6867d14773c3c0b10331d8c6";
      const targetId = selectedUser;

      socket.emit("join room", { userId, targetId });
      socket.emit("chat message", {
        userId,
        targetId,
        text: input,
      });
      setInput("");
    }
  };

  useEffect(() => {
    if (_id) {
      setSelectedUser(_id);
    } else if (users.length > 0) {
      navigate(`/chat/${users[0]._id}`, { replace: true });
    }
  }, [_id, users, navigate]);

  useEffect(() => {
    const fetchusersChats = async () => {
      try {
        const res = await userGetChats(selectedUser);

        const chatMessage = res?.data?.messages?.map((msg) => {
          return {
            text: msg?.text,
            userId: msg?.sender?._id,
            chattime: msg?.createdAt,
          };
        });
        setMessages(chatMessage);
      } catch (error) {
        console.log(error);
      }
    };
    fetchusersChats();
  }, [selectedUser]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-2">
      <div className="w-full max-w-6xl h-[80vh] bg-white shadow-2xl rounded-2xl grid grid-cols-5 overflow-hidden border border-gray-300">
        {/* Sidebar */}
        <div className="col-span-2 bg-gray-50 p-5 border-r">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Chats</h2>

          <ul className="space-y-4 overflow-y-auto max-h-[75vh] pr-2">
            {users?.map((user) => (
              <li
                key={user._id}
                onClick={() => {
                  navigate(`/chat/${user._id}`);
                  setMessages([]);
                }}
                className={`flex items-center gap-3 p-3 rounded-xl shadow-sm  transition cursor-pointer  ${
                  user._id === selectedUser
                    ? "bg-green-100    "
                    : "bg-white hover:bg-green-50"
                }`}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=random&bold=true`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-gray-800 font-semibold text-sm capitalize">
                    {user.name}
                  </h4>
                </div>
              </li>
            ))}
          </ul>

          {users.length === 0 && (
            <div className="text-sm text-gray-400 mt-6 text-center">
              No users found.
            </div>
          )}
        </div>

        {/* Chat Area */}
        {selectedUser && (
          <div className="col-span-3 flex flex-col relative">
            {/* Header */}
            <div className="bg-green-500 text-white text-xl font-semibold p-5 shadow-sm capitalize">
              Chat with {users.find((user) => user?._id === selectedUser)?.name}
            </div>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
              {messages.map((msg, i) => {
                const isOwn = msg?.userId === userId;
                return (
                  <div
                    key={i}
                    className={`flex ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm max-w-xs break-words shadow relative ${
                        isOwn
                          ? "bg-green-500 text-white rounded-br-none"
                          : "bg-gray-200 text-black rounded-bl-none"
                      }`}
                    >
                      <div>{msg.text}</div>
                      <div className="text-[10px] mt-1 text-right opacity-70">
                        {dayjs(msg?.chattime).format("hh:mm A")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Box */}
            <div className="p-4 border-t bg-white flex items-center gap-3 absolute bottom-0 w-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-5 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleMessage}
                className="p-3 bg-green-500 hover:bg-green-600 rounded-full transition text-white shadow-lg"
              >
                <SendHorizontal size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
