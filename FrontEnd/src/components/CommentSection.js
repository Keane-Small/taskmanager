import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSend, FiTrash2, FiEdit2, FiMoreVertical } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CommentsContainer = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #F0F0F0;
`;

const CommentsHeader = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin: 0 0 20px 0;
`;

const CommentsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F0F0F0;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #CCC;
    border-radius: 3px;
  }
`;

const CommentItem = styled(motion.div)`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px;
  background: #FAFAFA;
  border-radius: 12px;
  transition: background 0.2s;
  
  &:hover {
    background: #F5F5F5;
  }
`;

const CommentAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.$color || '#E0E0E0'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const CommentAuthor = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #000;
`;

const CommentTime = styled.div`
  font-size: 12px;
  color: #999;
`;

const CommentText = styled.div`
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  word-wrap: break-word;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  
  &:hover {
    background: #E0E0E0;
    color: #000;
  }
`;

const EditedBadge = styled.span`
  font-size: 11px;
  color: #999;
  font-style: italic;
  margin-left: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const CommentInput = styled.textarea`
  flex: 1;
  padding: 12px;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #000;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button`
  padding: 12px 20px;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  color: #FFF;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
`;

const CommentSection = ({ taskId, projectId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [taskId, projectId]);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const query = taskId ? `taskId=${taskId}` : `projectId=${projectId}`;
      const response = await fetch(`${API_URL}/comments?${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: newComment,
          taskId,
          projectId
        })
      });

      if (response.ok) {
        const comment = await response.json();
        setComments([comment, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: editText })
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments(comments.map(c => c._id === commentId ? updatedComment : c));
        setEditingId(null);
        setEditText('');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#95E1D3', '#FFD93D', '#6C5CE7', '#A29BFE', '#FD79A8', '#74B9FF'];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const formatTime = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return commentDate.toLocaleDateString();
  };

  return (
    <CommentsContainer>
      <CommentsHeader>Comments ({comments.length})</CommentsHeader>
      
      <CommentsList>
        <AnimatePresence>
          {comments.length === 0 ? (
            <EmptyState>No comments yet. Be the first to comment!</EmptyState>
          ) : (
            comments.map(comment => (
              <CommentItem
                key={comment._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <CommentAvatar $color={getAvatarColor(comment.user?.name)}>
                  {comment.user?.profilePicture ? (
                    <img src={comment.user.profilePicture} alt={comment.user.name} />
                  ) : (
                    getInitials(comment.user?.name)
                  )}
                </CommentAvatar>
                
                <CommentContent>
                  <CommentHeader>
                    <CommentAuthor>
                      {comment.user?.name || 'Unknown User'}
                      {comment.edited && <EditedBadge>(edited)</EditedBadge>}
                    </CommentAuthor>
                    <CommentTime>{formatTime(comment.createdAt)}</CommentTime>
                  </CommentHeader>
                  
                  {editingId === comment._id ? (
                    <div>
                      <CommentInput
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                      />
                      <CommentActions>
                        <ActionButton onClick={() => handleEdit(comment._id)}>
                          Save
                        </ActionButton>
                        <ActionButton onClick={() => {
                          setEditingId(null);
                          setEditText('');
                        }}>
                          Cancel
                        </ActionButton>
                      </CommentActions>
                    </div>
                  ) : (
                    <>
                      <CommentText>{comment.text}</CommentText>
                      
                      {comment.user?._id === user?._id && (
                        <CommentActions>
                          <ActionButton onClick={() => {
                            setEditingId(comment._id);
                            setEditText(comment.text);
                          }}>
                            <FiEdit2 size={12} /> Edit
                          </ActionButton>
                          <ActionButton onClick={() => handleDelete(comment._id)}>
                            <FiTrash2 size={12} /> Delete
                          </ActionButton>
                        </CommentActions>
                      )}
                    </>
                  )}
                </CommentContent>
              </CommentItem>
            ))
          )}
        </AnimatePresence>
      </CommentsList>

      <form onSubmit={handleSubmit}>
        <InputContainer>
          <CommentInput
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            disabled={loading}
          />
          <SendButton type="submit" disabled={loading || !newComment.trim()}>
            <FiSend size={16} />
            Send
          </SendButton>
        </InputContainer>
      </form>
    </CommentsContainer>
  );
};

export default CommentSection;
