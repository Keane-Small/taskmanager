import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { getTasksForProject } from '../data/tasksDatabase';

const BoardContainer = styled.div`
  position: fixed;
  left: 95px;
  top: 10px;
  right: 15px;
  bottom: 10px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 30px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #F0F0F0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #F0F0F0;
  }
`;

const ProjectTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #000000;
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const MetaItem = styled.span`
  font-size: 14px;
  color: #666;
`;

const BoardContent = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
`;

const ColumnsContainer = styled.div`
  display: flex;
  gap: 20px;
  height: 100%;
  min-width: min-content;
`;

const Column = styled.div`
  background-color: #F9F9F9;
  border-radius: 12px;
  padding: 16px;
  min-width: 320px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ColumnTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TaskCount = styled.span`
  background-color: #E0E0E0;
  color: #666;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const TaskList = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 100px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F0F0F0;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #CCCCCC;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #999999;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
`;

const DroppableColumn = ({ id, children }) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} style={{ flex: 1, minHeight: '100px' }}>
      {children}
    </div>
  );
};

const TaskBoard = ({ project, onClose }) => {
  const initialTasks = getTasksForProject(project.id);
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Get the active task
    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Check if we're over a column (droppable area)
    const overColumn = ['todo', 'in-progress', 'completed'].find(col => col === overId);
    
    if (overColumn && activeTask.status !== overColumn) {
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === activeId) {
            return { ...task, status: overColumn };
          }
          return task;
        });
      });
    } else {
      // Check if we're over another task
      const overTask = tasks.find(t => t.id === overId);
      if (overTask && activeTask.status !== overTask.status) {
        setTasks(prevTasks => {
          return prevTasks.map(task => {
            if (task.id === activeId) {
              return { ...task, status: overTask.status };
            }
            return task;
          });
        });
      }
    }
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
  };

  const handleMoveTask = (task) => {
    let newStatus;
    if (task.status === 'todo') {
      newStatus = 'in-progress';
    } else if (task.status === 'in-progress') {
      newStatus = 'completed';
    } else {
      return; // Already completed
    }

    setTasks(prevTasks => {
      return prevTasks.map(t => {
        if (t.id === task.id) {
          return { ...t, status: newStatus };
        }
        return t;
      });
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <BoardContainer>
        <BoardHeader>
          <HeaderLeft>
            <BackButton onClick={onClose}>
              <FiArrowLeft size={24} />
            </BackButton>
            <div>
              <ProjectTitle>{project.name}</ProjectTitle>
              <ProjectMeta>
                <MetaItem>Due: {project.dueDate}</MetaItem>
                <MetaItem>Status: {project.status}</MetaItem>
                <MetaItem>Tasks: {tasks.length}</MetaItem>
              </ProjectMeta>
            </div>
          </HeaderLeft>
        </BoardHeader>

        <BoardContent>
          <ColumnsContainer>
            <Column>
              <ColumnHeader>
                <ColumnTitle>To Do</ColumnTitle>
                <TaskCount>{todoTasks.length}</TaskCount>
              </ColumnHeader>
              <DroppableColumn id="todo">
                <TaskList>
                  <SortableContext items={todoTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {todoTasks.length > 0 ? (
                      todoTasks.map(task => (
                        <TaskCard key={task.id} task={task} onMoveTask={handleMoveTask} />
                      ))
                    ) : (
                      <EmptyState>Drop tasks here</EmptyState>
                    )}
                  </SortableContext>
                </TaskList>
              </DroppableColumn>
            </Column>

            <Column>
              <ColumnHeader>
                <ColumnTitle>In Progress</ColumnTitle>
                <TaskCount>{inProgressTasks.length}</TaskCount>
              </ColumnHeader>
              <DroppableColumn id="in-progress">
                <TaskList>
                  <SortableContext items={inProgressTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {inProgressTasks.length > 0 ? (
                      inProgressTasks.map(task => (
                        <TaskCard key={task.id} task={task} onMoveTask={handleMoveTask} />
                      ))
                    ) : (
                      <EmptyState>Drop tasks here</EmptyState>
                    )}
                  </SortableContext>
                </TaskList>
              </DroppableColumn>
            </Column>

            <Column>
              <ColumnHeader>
                <ColumnTitle>Completed</ColumnTitle>
                <TaskCount>{completedTasks.length}</TaskCount>
              </ColumnHeader>
              <DroppableColumn id="completed">
                <TaskList>
                  <SortableContext items={completedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {completedTasks.length > 0 ? (
                      completedTasks.map(task => (
                        <TaskCard key={task.id} task={task} onMoveTask={handleMoveTask} />
                      ))
                    ) : (
                      <EmptyState>Drop tasks here</EmptyState>
                    )}
                  </SortableContext>
                </TaskList>
              </DroppableColumn>
            </Column>
          </ColumnsContainer>
        </BoardContent>
      </BoardContainer>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;
