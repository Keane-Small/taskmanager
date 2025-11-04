import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiFolder, FiCheckCircle, FiEdit, FiTrash2, FiMessageSquare, 
  FiUserPlus, FiUserMinus, FiUpload, FiMove, FiClock 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const FeedContainer = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FeedTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin: 0;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const FilterButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.$active ? '#000' : '#E0E0E0'};
  background: ${props => props.$active ? '#000' : '#FFF'};
  color: ${props => props.$active ? '#FFF' : '#666'};
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #000;
    background: ${props => props.$active ? '#000' : '#F5F5F5'};
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 500px;
  overflow-y: auto;
  
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

const ActivityItem = styled(motion.div)`
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #FAFAFA;
  border-radius: 12px;
  transition: background 0.2s;
  
  &:hover {
    background: #F0F0F0;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.$color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 14px;
  color: #000;
  margin-bottom: 4px;
  
  strong {
    font-weight: 600;
  }
`;

const ActivityMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #999;
`;

const ActivityTime = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
`;

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  background: none;
  border: 2px dashed #E0E0E0;
  border-radius: 12px;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #000;
    color: #000;
    background: #F5F5F5;
  }
`;

const ActivityFeed = ({ projectId = null, limit = 20 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    fetchActivities(true);
  }, [projectId, filter]);

  const fetchActivities = async (reset = false) => {
    try {
      const token = localStorage.getItem('token');
      const currentSkip = reset ? 0 : skip;
      let url = `${API_URL}/activities?limit=${limit}&skip=${currentSkip}`;
      
      if (projectId) {
        url += `&projectId=${projectId}`;
      }
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setActivities(reset ? data.activities : [...activities, ...data.activities]);
        setHasMore(data.hasMore);
        setSkip(currentSkip + data.activities.length);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchActivities(false);
  };

  const getActivityIcon = (action) => {
    const iconMap = {
      created_project: { icon: FiFolder, color: '#6366F1' },
      updated_project: { icon: FiEdit, color: '#10B981' },
      deleted_project: { icon: FiTrash2, color: '#EF4444' },
      created_task: { icon: FiCheckCircle, color: '#3B82F6' },
      updated_task: { icon: FiEdit, color: '#10B981' },
      deleted_task: { icon: FiTrash2, color: '#EF4444' },
      completed_task: { icon: FiCheckCircle, color: '#10B981' },
      commented: { icon: FiMessageSquare, color: '#8B5CF6' },
      assigned_task: { icon: FiUserPlus, color: '#F59E0B' },
      moved_task: { icon: FiMove, color: '#06B6D4' },
      added_member: { icon: FiUserPlus, color: '#10B981' },
      removed_member: { icon: FiUserMinus, color: '#EF4444' },
      uploaded_file: { icon: FiUpload, color: '#EC4899' }
    };
    
    return iconMap[action] || { icon: FiCheckCircle, color: '#6366F1' };
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return activityDate.toLocaleDateString();
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'projects') return activity.action.includes('project');
    if (filter === 'tasks') return activity.action.includes('task');
    if (filter === 'comments') return activity.action === 'commented';
    return true;
  });

  return (
    <FeedContainer>
      <FeedHeader>
        <FeedTitle>Recent Activity</FeedTitle>
        <FilterButtons>
          <FilterButton 
            $active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            $active={filter === 'projects'} 
            onClick={() => setFilter('projects')}
          >
            Projects
          </FilterButton>
          <FilterButton 
            $active={filter === 'tasks'} 
            onClick={() => setFilter('tasks')}
          >
            Tasks
          </FilterButton>
          <FilterButton 
            $active={filter === 'comments'} 
            onClick={() => setFilter('comments')}
          >
            Comments
          </FilterButton>
        </FilterButtons>
      </FeedHeader>

      <ActivityList>
        <AnimatePresence>
          {loading && activities.length === 0 ? (
            <EmptyState>Loading activities...</EmptyState>
          ) : filteredActivities.length === 0 ? (
            <EmptyState>No activities yet</EmptyState>
          ) : (
            filteredActivities.map((activity, index) => {
              const { icon: Icon, color } = getActivityIcon(activity.action);
              
              return (
                <ActivityItem
                  key={activity._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ActivityIcon $color={color}>
                    <Icon size={20} />
                  </ActivityIcon>
                  
                  <ActivityContent>
                    <ActivityText>
                      <strong>{activity.user?.name || 'Someone'}</strong> {activity.description}
                    </ActivityText>
                    <ActivityMeta>
                      <ActivityTime>
                        <FiClock size={12} />
                        {formatTime(activity.createdAt)}
                      </ActivityTime>
                    </ActivityMeta>
                  </ActivityContent>
                </ActivityItem>
              );
            })
          )}
        </AnimatePresence>
      </ActivityList>

      {hasMore && !loading && (
        <LoadMoreButton onClick={handleLoadMore}>
          Load More
        </LoadMoreButton>
      )}
    </FeedContainer>
  );
};

export default ActivityFeed;
