import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FiSearch, FiSend, FiMoreVertical, FiPlus, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const PageContainer = styled.div`
  position: fixed;
  left: 95px;
  top: 10px;
  right: 15px;
  bottom: 10px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  display: flex;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 320px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
`;

const SidebarHeader = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #000000;
`;

const NewMessageButton = styled.button`
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background-color: #333;
    transform: scale(1.05);
  }
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #000;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 20px 0;
  background-color: #fff;
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px 16px;
  border: none;
  background-color: ${(props) => (props.$isActive ? "#235347" : "transparent")};
  color: ${(props) => (props.$isActive ? "#fff" : "#163832")};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#163832" : "rgba(142, 182, 155, 0.2)")};
  }
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const ConversationItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
  background-color: ${(props) => (props.$isActive ? "#235347" : "transparent")};
  color: ${(props) => (props.$isActive ? "#fff" : "#0B2B26")};
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#163832" : "rgba(142, 182, 155, 0.2)")};
  }
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${(props) => props.$color || "#ddd"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  color: #fff;
  margin-right: 12px;
  flex-shrink: 0;
  position: relative;
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #4ade80;
  border: 2px solid #fff;
`;

const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConversationName = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: #000;
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ConversationMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const Timestamp = styled.div`
  font-size: 12px;
  opacity: 0.6;
`;

const UnreadBadge = styled.div`
  background-color: ${(props) => (props.$isActive ? "#DAF1DE" : "#235347")};
  color: ${(props) => (props.$isActive ? "#0B2B26" : "#fff")};
  border-radius: 12px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 700;
  margin-top: 4px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

const ChatHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ChatHeaderName = styled.div`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 2px;
`;

const ChatHeaderStatus = styled.div`
  font-size: 13px;
  color: #4ade80;
`;

const CollaboratorsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const CollaboratorAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.$color || "#ddd"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  border: 2px solid #fff;
  margin-left: -8px;

  &:first-child {
    margin-left: 0;
  }
`;

const CollaboratorCount = styled.div`
  font-size: 13px;
  color: #666;
  margin-left: 4px;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isSent ? "flex-end" : "flex-start")};
  gap: 4px;
  margin-bottom: 8px;
`;

const SenderName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #666;
  padding: 0 8px;
  margin-bottom: 2px;
`;

const Message = styled(motion.div)`
  max-width: 60%;
  padding: 12px 16px;
  border-radius: ${(props) => 
    props.$isSent 
      ? "16px 16px 4px 16px" 
      : "16px 16px 16px 4px"
  };
  background-color: ${(props) => (props.$isSent ? "#235347" : "#DAF1DE")};
  color: ${(props) => (props.$isSent ? "#fff" : "#0B2B26")};
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: #999;
  padding: 0 8px;
  text-align: ${(props) => (props.$isSent ? "right" : "left")};
`;

const InputArea = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  align-items: center;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #000;
  }
`;

const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ModalContent = styled.div`
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
`;

const UserListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 8px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const MessagesPage = () => {
  const { user } = useAuth();
  const { markAsRead } = useMessages();
  const [activeTab, setActiveTab] = useState("direct");
  const [conversationUsers, setConversationUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUserId = user?._id || user?.id;

  // Fetch users and projects
  useEffect(() => {
    fetchUsers();
    fetchProjects();
    fetchUnreadCountsForAllUsers();
    
    // Poll for unread counts every 5 seconds
    const interval = setInterval(fetchUnreadCountsForAllUsers, 5000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      if (selectedChat.type === "direct") {
        fetchDirectMessages(selectedChat._id);
        // Mark messages as read when opening a direct chat
        markAsRead(selectedChat._id).then(() => {
          // Refresh unread counts after marking as read
          fetchUnreadCountsForAllUsers();
        });
        
        const interval = setInterval(() => {
          fetchDirectMessages(selectedChat._id);
        }, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
      } else if (selectedChat.type === "group") {
        fetchProjectMessages(selectedChat._id);
        const interval = setInterval(() => {
          fetchProjectMessages(selectedChat._id);
        }, 3000);
        return () => clearInterval(interval);
      }
    }
  }, [selectedChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const filteredUsers = data.filter((u) => u._id !== currentUserId);
        setAllUsers(filteredUsers);
        
        // Get users with existing conversations
        const usersWithConversations = [];
        for (const otherUser of filteredUsers) {
          const messagesResponse = await fetch(
            `${API_URL}/direct-messages/${currentUserId}/${otherUser._id}`
          );
          
          if (messagesResponse.ok) {
            const messages = await messagesResponse.json();
            if (messages.length > 0) {
              usersWithConversations.push(otherUser);
            }
          }
        }
        
        setConversationUsers(usersWithConversations);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setConversationUsers([]);
      setAllUsers([]);
    }
  };

  const fetchUnreadCountsForAllUsers = async () => {
    if (!currentUserId) return;
    
    try {
      const response = await fetch(`${API_URL}/direct-messages/unread/${currentUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        // The backend returns total count, but we need per-user counts
        // Let's fetch messages for each user to count unread
        const token = localStorage.getItem("token");
        const usersResponse = await fetch(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (usersResponse.ok) {
          const allUsers = await usersResponse.json();
          const counts = {};
          
          for (const otherUser of allUsers) {
            if (otherUser._id !== currentUserId) {
              const messagesResponse = await fetch(
                `${API_URL}/direct-messages/${currentUserId}/${otherUser._id}`
              );
              
              if (messagesResponse.ok) {
                const messages = await messagesResponse.json();
                // Count unread messages from this user
                const unreadCount = messages.filter(
                  msg => {
                    const senderId = msg.sender?._id || msg.sender;
                    return senderId === otherUser._id && msg.read === false;
                  }
                ).length;
                
                if (unreadCount > 0) {
                  counts[otherUser._id] = unreadCount;
                }
              }
            }
          }
          
          setUnreadCounts(counts);
        }
      }
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  const fetchDirectMessages = async (userId) => {
    try {
      const response = await fetch(
        `${API_URL}/direct-messages/${currentUserId}/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchProjectMessages = async (projectId) => {
    try {
      const response = await fetch(`${API_URL}/messages/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching project messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    let messageData, endpoint;

    if (selectedChat.type === "direct") {
      messageData = {
        sender: currentUserId,
        recipient: selectedChat._id,
        content: newMessage.trim(),
      };
      endpoint = `${API_URL}/direct-messages`;
    } else {
      messageData = {
        sender: currentUserId,
        project: selectedChat._id,
        content: newMessage.trim(),
      };
      endpoint = `${API_URL}/messages`;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages((prev) => [...prev, sentMessage]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E2",
    ];
    // Handle non-string inputs
    const nameStr = typeof name === 'string' ? name : (name?.name || name?.email || 'User');
    const index = nameStr.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000)
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredConversationUsers = conversationUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAllUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContainer>
      <Sidebar>
        <SidebarHeader>
          <TitleRow>
            <Title>Messages</Title>
            <NewMessageButton onClick={() => setShowNewMessageModal(true)}>
              <FiPlus size={16} />
              New
            </NewMessageButton>
          </TitleRow>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>
        </SidebarHeader>
        <TabContainer>
          <Tab
            $isActive={activeTab === "direct"}
            onClick={() => setActiveTab("direct")}
          >
            Direct Messages
          </Tab>
          <Tab
            $isActive={activeTab === "group"}
            onClick={() => setActiveTab("group")}
          >
            Group Chats
          </Tab>
        </TabContainer>
        <ConversationList>
          {activeTab === "direct"
            ? filteredConversationUsers.map((user) => (
                <ConversationItem
                  key={user._id}
                  $isActive={
                    selectedChat?._id === user._id &&
                    selectedChat?.type === "direct"
                  }
                  onClick={() => setSelectedChat({ ...user, type: "direct" })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar $color={getAvatarColor(user.name)}>
                    {getInitials(user.name)}
                    {user.online && <OnlineIndicator />}
                  </Avatar>
                  <ConversationInfo>
                    <ConversationName>{user.name}</ConversationName>
                    <LastMessage>Click to start chatting</LastMessage>
                  </ConversationInfo>
                  <ConversationMeta>
                    <Timestamp>2m</Timestamp>
                    {unreadCounts[user._id] > 0 && (
                      <UnreadBadge $isActive={selectedChat?._id === user._id && selectedChat?.type === "direct"}>
                        {unreadCounts[user._id]}
                      </UnreadBadge>
                    )}
                  </ConversationMeta>
                </ConversationItem>
              ))
            : filteredProjects.map((project) => (
                <ConversationItem
                  key={project._id}
                  $isActive={
                    selectedChat?._id === project._id &&
                    selectedChat?.type === "group"
                  }
                  onClick={() => setSelectedChat({ ...project, type: "group" })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar $color={getAvatarColor(project.name)}>👥</Avatar>
                  <ConversationInfo>
                    <ConversationName>{project.name}</ConversationName>
                    <LastMessage>
                      {project.description || "Project group chat"}
                    </LastMessage>
                  </ConversationInfo>
                  <ConversationMeta>
                    <Timestamp>1h</Timestamp>
                  </ConversationMeta>
                </ConversationItem>
              ))}
        </ConversationList>
      </Sidebar>

      <ChatArea>
        {selectedChat ? (
          <>
            <ChatHeader>
              <ChatHeaderInfo>
                <Avatar $color={getAvatarColor(selectedChat.name)}>
                  {selectedChat.type === "direct"
                    ? getInitials(selectedChat.name)
                    : "👥"}
                  {selectedChat.type === "direct" && selectedChat.online && (
                    <OnlineIndicator />
                  )}
                </Avatar>
                <div>
                  <ChatHeaderName>{selectedChat.name}</ChatHeaderName>
                  <ChatHeaderStatus>
                    {selectedChat.type === "direct"
                      ? selectedChat.online
                        ? "Active now"
                        : "Offline"
                      : "Group Chat"}
                  </ChatHeaderStatus>
                  {selectedChat.type === "group" &&
                    selectedChat.collaborators &&
                    selectedChat.collaborators.length > 0 && (
                      <CollaboratorsContainer>
                        {selectedChat.collaborators
                          .slice(0, 5)
                          .map((collab, idx) => {
                            // Handle both string and object formats
                            const displayName = typeof collab === 'string' 
                              ? collab 
                              : collab.userId?.name || collab.userId?.email || collab.name || collab.email || 'User';
                            const initials = getInitials(displayName);
                            
                            return (
                              <CollaboratorAvatar
                                key={idx}
                                $color={getAvatarColor(displayName)}
                                title={displayName}
                              >
                                {initials}
                              </CollaboratorAvatar>
                            );
                          })}
                        {selectedChat.collaborators.length > 5 && (
                          <CollaboratorCount>
                            +{selectedChat.collaborators.length - 5} more
                          </CollaboratorCount>
                        )}
                      </CollaboratorsContainer>
                    )}
                </div>
              </ChatHeaderInfo>
              <MoreButton>
                <FiMoreVertical size={20} />
              </MoreButton>
            </ChatHeader>

            <MessagesContainer>
              <AnimatePresence>
                {messages.map((msg, index) => {
                  const senderId = msg.sender?._id || msg.sender;
                  const isSent = senderId === currentUserId;
                  const senderName = msg.sender?.name || selectedChat?.name;
                  
                  return (
                    <MessageGroup key={msg._id || index} $isSent={isSent}>
                      {!isSent && selectedChat?.type === 'group' && (
                        <SenderName>{senderName}</SenderName>
                      )}
                      <Message
                        $isSent={isSent}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {msg.content}
                      </Message>
                      <MessageTime $isSent={isSent}>{formatTime(msg.timestamp)}</MessageTime>
                    </MessageGroup>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputArea>
              <MessageInput
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SendButton onClick={sendMessage} disabled={!newMessage.trim()}>
                <FiSend size={18} />
              </SendButton>
            </InputArea>
          </>
        ) : (
          <EmptyState>
            <h3>Select a conversation</h3>
            <p>Choose a contact to start messaging</p>
          </EmptyState>
        )}
      </ChatArea>

      {/* New Message Modal */}
      <AnimatePresence>
        {showNewMessageModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewMessageModal(false)}
          >
            <ModalContainer
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>New Message</ModalTitle>
                <CloseButton onClick={() => setShowNewMessageModal(false)}>
                  <FiX size={20} />
                </CloseButton>
              </ModalHeader>
              <ModalContent>
                <SearchContainer style={{ marginBottom: '16px' }}>
                  <SearchIcon />
                  <SearchInput
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </SearchContainer>
                {filteredAllUsers.map((user) => (
                  <UserListItem
                    key={user._id}
                    onClick={() => {
                      setSelectedChat({ ...user, type: 'direct' });
                      setShowNewMessageModal(false);
                      setSearchQuery('');
                    }}
                  >
                    <Avatar $color={getAvatarColor(user.name)}>
                      {getInitials(user.name)}
                    </Avatar>
                    <ConversationInfo style={{ marginLeft: '12px' }}>
                      <ConversationName>{user.name}</ConversationName>
                      <LastMessage>{user.email}</LastMessage>
                    </ConversationInfo>
                  </UserListItem>
                ))}
              </ModalContent>
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default MessagesPage;
