import React from 'react';
import styled from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiArrowRight, FiCheck, FiEdit2 } from 'react-icons/fi';

const Card = styled.div`
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    cursor: grabbing;
  }
  
  ${props => props.isDragging && `
    opacity: 0.5;
  `}
`;

const TaskTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleText = styled.span`
  flex: 1;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #000;
  }
`;

const TaskDescription = styled.p`
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
`;

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const AssignedTo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background-color: ${props => props.completed ? '#00C853' : '#000000'};
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
    background-color: ${props => props.completed ? '#00A844' : '#333333'};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #FFFDD0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: #000;
`;

const AssignedLabel = styled.span`
  font-size: 11px;
  color: #999;
`;

const TaskCard = ({ task, isDragging, onMoveTask, showCompleteState, onEditTask }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleMoveClick = (e) => {
    e.stopPropagation();
    if (onMoveTask) {
      onMoveTask(task);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEditTask) {
      onEditTask(task);
    }
  };

  const getButtonText = () => {
    if (task.status === 'completed') return null;
    
    // Show "Complete" temporarily after moving to in-progress, or permanently in completed
    if (showCompleteState && task.status === 'in-progress') {
      return 'Complete';
    }
    
    return 'Next';
  };

  const buttonText = getButtonText();
  const showButton = task.status !== 'completed';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      isDragging={isDragging}
    >
      <TaskTitle>
        <TitleText>{task.title}</TitleText>
        <EditButton 
          onClick={handleEditClick}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <FiEdit2 size={14} />
        </EditButton>
      </TaskTitle>
      <TaskDescription>{task.description}</TaskDescription>
      <TaskFooter>
        <AssignedTo>
          <AssignedLabel>Assigned to:</AssignedLabel>
          {Array.isArray(task.assignedTo) ? (
            task.assignedTo.map((person, index) => (
              <Avatar key={index}>{person}</Avatar>
            ))
          ) : (
            <Avatar>{task.assignedTo}</Avatar>
          )}
        </AssignedTo>
        {showButton && (
          <ActionButton 
            onClick={handleMoveClick}
            completed={showCompleteState && task.status === 'in-progress'}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {showCompleteState && task.status === 'in-progress' ? <FiCheck size={12} /> : <FiArrowRight size={12} />}
            {buttonText}
          </ActionButton>
        )}
      </TaskFooter>
    </Card>
  );
};

export default TaskCard;
