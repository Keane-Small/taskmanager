import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../../services/api';
import { API_ENDPOINTS } from '../../constants/api';
import { User, DirectMessage } from '../../types';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

interface Project {
  _id: string;
  name: string;
  description?: string;
  collaborators: Array<{ user: User }>;
}

interface ProjectMessage {
  _id: string;
  senderId: User;
  projectId: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  user: User;
  lastMessage: DirectMessage | null;
  unreadCount: number;
}

type ChatType = 'direct' | 'project';

interface ActiveChat {
  type: ChatType;
  data: Conversation | Project;
}

const MessagesScreen: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ChatType>('direct');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Chat state
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [messages, setMessages] = useState<(DirectMessage | ProjectMessage)[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  // New conversation modal
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (activeTab === 'direct') {
      await fetchConversations();
    } else {
      await fetchProjects();
    }
  };

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const userId = currentUser?._id;
      
      if (!userId) {
        console.error('No user ID available');
        setIsLoading(false);
        return;
      }
      
      // Fetch all users to build conversations
      const users = await apiService.get<User[]>('/users');
      const conversationsData: Conversation[] = [];

      for (const user of users) {
        if (user._id !== userId) {
          try {
            // Fetch messages between current user and this user
            const msgs = await apiService.get<DirectMessage[]>(
              `/direct-messages/${userId}/${user._id}`
            );
            
            // Get unread count
            let unreadCount = 0;
            try {
              const unreadData = await apiService.get<{ count: number }>(
                `/direct-messages/unread/${userId}`
              );
              // Filter unread messages from this specific user
              // Handle both populated and non-populated senderId
              unreadCount = msgs.filter(m => {
                const senderId = typeof m.senderId === 'object' ? m.senderId._id : m.senderId;
                return !m.read && senderId === user._id;
              }).length;
            } catch (e) {
              console.log('Error fetching unread count:', e);
            }

            conversationsData.push({
              user,
              lastMessage: msgs.length > 0 ? msgs[msgs.length - 1] : null,
              unreadCount,
            });
          } catch (error) {
            console.log(`No messages with ${user.name}`);
          }
        }
      }

      // Sort by last message time
      conversationsData.sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const bTime = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return bTime - aTime;
      });

      setConversations(conversationsData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.get<Project[]>('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConversations();
    setRefreshing(false);
  };

  const fetchMessages = async (userId: string) => {
    setIsLoadingMessages(true);
    try {
      const currentUserId = currentUser?._id;
      if (!currentUserId) {
        console.error('No current user ID');
        setIsLoadingMessages(false);
        return;
      }
      const data = await apiService.get<DirectMessage[]>(`/direct-messages/${currentUserId}/${userId}`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const openChat = (conversation: Conversation) => {
    if (!conversation || !conversation.user) {
      console.error('Invalid conversation data');
      return;
    }
    setActiveChat({ type: 'direct', data: conversation });
    fetchMessages(conversation.user._id);
  };

  const closeChat = () => {
    setActiveChat(null);
    setMessages([]);
    setMessageText('');
    fetchConversations(); // Refresh conversations to update read status
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !activeChat) return;

    setIsSending(true);
    try {
      if (activeChat.type === 'direct') {
        const conversation = activeChat.data as Conversation;
        const newMessage = await apiService.post<DirectMessage>('/direct-messages', {
          recipientId: conversation.user._id,
          content: messageText.trim(),
        });
        
        setMessages([...messages, newMessage]);
        setMessageText('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const data = await apiService.get<User[]>('/users');
      setAllUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const startNewChat = (user: User) => {
    const newConversation: Conversation = {
      user,
      lastMessage: null,
      unreadCount: 0,
    };
    setShowNewChatModal(false);
    openChat(newConversation);
  };

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity style={styles.conversationItem} onPress={() => openChat(item)}>
      <View style={styles.avatar}>
        {item.user.profilePicture ? (
          <Image source={{ uri: item.user.profilePicture }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.user.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.user.name}</Text>
          {item.lastMessage && (
            <Text style={styles.conversationTime}>
              {formatMessageTime(item.lastMessage.createdAt)}
            </Text>
          )}
        </View>
        
        {item.lastMessage && (
          <View style={styles.lastMessageContainer}>
            <Text
              style={[styles.lastMessage, item.unreadCount > 0 && styles.unreadMessage]}
              numberOfLines={1}
            >
              {item.lastMessage.content}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: DirectMessage }) => {
    // Handle both populated and non-populated senderId
    const senderId = typeof item.senderId === 'object' ? item.senderId._id : item.senderId;
    const currentUserId = currentUser?._id;
    const isOwnMessage = senderId === currentUserId;
    
    return (
      <View style={[styles.messageContainer, isOwnMessage && styles.ownMessageContainer]}>
        <View style={[styles.messageBubble, isOwnMessage && styles.ownMessageBubble]}>
          <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
            {item.content}
          </Text>
          <Text style={[styles.messageTime, isOwnMessage && styles.ownMessageTime]}>
            {new Date(item.createdAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Chat view
  if (activeChat && activeChat.type === 'direct') {
    const conversation = activeChat.data as Conversation;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={closeChat} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.chatHeaderInfo}>
            <View style={styles.chatAvatar}>
              {conversation.user.profilePicture ? (
                <Image
                  source={{ uri: conversation.user.profilePicture }}
                  style={styles.chatAvatarImage}
                />
              ) : (
                <View style={styles.chatAvatarPlaceholder}>
                  <Text style={styles.chatAvatarText}>
                    {conversation.user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.chatHeaderName}>{conversation.user.name}</Text>
          </View>
        </View>

        {/* Messages List */}
        {isLoadingMessages ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={messages as DirectMessage[]}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.messagesContent}
            inverted={false}
          />
        )}

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!messageText.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Conversations list view
  return (
    <View style={styles.container}>
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.textLight} />
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>Start a new conversation</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.user._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {/* New Message FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          fetchAllUsers();
          setShowNewChatModal(true);
        }}
      >
        <Ionicons name="create" size={24} color="#fff" />
      </TouchableOpacity>

      {/* New Chat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewChatModal}
        onRequestClose={() => setShowNewChatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Message</Text>
              <TouchableOpacity onPress={() => setShowNewChatModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={allUsers}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.userItem}
                  onPress={() => startNewChat(item)}
                >
                  <View style={styles.avatar}>
                    {item.profilePicture ? (
                      <Image source={{ uri: item.profilePicture }} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                      </View>
                    )}
                  </View>
                  <View>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },
  emptySubtext: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    marginRight: theme.spacing.md,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  conversationName: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  conversationTime: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textLight,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textLight,
    flex: 1,
  },
  unreadMessage: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: theme.fontSizes.xs,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : theme.spacing.md,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatAvatar: {
    marginRight: theme.spacing.sm,
  },
  chatAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  chatAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarText: {
    color: '#fff',
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
  },
  chatHeaderName: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: '#fff',
  },
  messagesContent: {
    padding: theme.spacing.md,
  },
  messageContainer: {
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start',
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownMessageBubble: {
    backgroundColor: theme.colors.primary,
  },
  messageText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  ownMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textLight,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
    maxHeight: 100,
    marginRight: theme.spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: '600',
    color: theme.colors.text,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userName: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
});

export default MessagesScreen;
