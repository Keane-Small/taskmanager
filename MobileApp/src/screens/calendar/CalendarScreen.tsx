import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: string;
  assignedTo: any;
  project?: {
    _id: string;
    name: string;
  };
}

type ViewMode = 'month' | 'week' | 'day';

const CalendarScreen: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [currentDate, viewMode]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get<Task[]>('/tasks');
      // Filter tasks with due dates
      const tasksWithDates = response.filter(task => task.dueDate);
      setTasks(tasksWithDates);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const isSameMonth = (date: Date | null) => {
    if (!date) return false;
    return date.getMonth() === currentDate.getMonth();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#FF4444';
      case 'high': return '#FF9800';
      case 'medium': return '#2196F3';
      case 'low': return '#4CAF50';
      default: return theme.colors.primary;
    }
  };

  const formatHeaderDate = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      const weekDays = getWeekDays();
      const start = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const end = weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${start} - ${end}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const renderMonthView = () => {
    const days = getMonthDays();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <View style={styles.monthContainer}>
        {/* Week day headers */}
        <View style={styles.weekHeader}>
          {weekDays.map(day => (
            <View key={day} style={styles.weekDayHeader}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Month grid */}
        <View style={styles.monthGrid}>
          {days.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isCurrentDay = isToday(date);
            const isCurrentMonth = isSameMonth(date);

            return (
              <View 
                key={index} 
                style={[
                  styles.monthDay,
                  !isCurrentMonth && styles.monthDayInactive
                ]}
              >
                {date && (
                  <>
                    <View style={[
                      styles.monthDayNumber,
                      isCurrentDay && styles.monthDayNumberToday
                    ]}>
                      <Text style={[
                        styles.monthDayNumberText,
                        isCurrentDay && styles.monthDayNumberTextToday
                      ]}>
                        {date.getDate()}
                      </Text>
                    </View>

                    {/* Task indicators */}
                    <View style={styles.monthDayTasks}>
                      {dayTasks.slice(0, 3).map((task, i) => (
                        <TouchableOpacity
                          key={task._id}
                          style={[styles.monthTask, { backgroundColor: getPriorityColor(task.priority) }]}
                          onPress={() => openTaskDetails(task)}
                        >
                          <Text style={styles.monthTaskText} numberOfLines={1}>
                            {task.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      {dayTasks.length > 3 && (
                        <Text style={styles.moreTasksText}>+{dayTasks.length - 3} more</Text>
                      )}
                    </View>
                  </>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();

    return (
      <ScrollView style={styles.weekContainer}>
        <View style={styles.weekHeader}>
          {weekDays.map((date, index) => {
            const isCurrentDay = isToday(date);
            return (
              <View key={index} style={styles.weekDayHeader}>
                <Text style={styles.weekDayText}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <View style={[
                  styles.weekDayNumber,
                  isCurrentDay && styles.weekDayNumberToday
                ]}>
                  <Text style={[
                    styles.weekDayNumberText,
                    isCurrentDay && styles.weekDayNumberTextToday
                  ]}>
                    {date.getDate()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.weekBody}>
          {weekDays.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            return (
              <View key={index} style={styles.weekDayColumn}>
                {dayTasks.map(task => (
                  <TouchableOpacity
                    key={task._id}
                    style={[styles.weekTask, { backgroundColor: getPriorityColor(task.priority) }]}
                    onPress={() => openTaskDetails(task)}
                  >
                    <Text style={styles.weekTaskTitle} numberOfLines={1}>{task.title}</Text>
                    {task.project && (
                      <Text style={styles.weekTaskProject} numberOfLines={1}>
                        {task.project.name}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderDayView = () => {
    const dayTasks = getTasksForDate(currentDate);

    return (
      <ScrollView style={styles.dayContainer}>
        <View style={styles.dayHeader}>
          <Text style={styles.dayHeaderDate}>
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Text style={styles.dayHeaderTaskCount}>{dayTasks.length} tasks</Text>
        </View>

        {dayTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>No tasks scheduled</Text>
          </View>
        ) : (
          <View style={styles.dayTaskList}>
            {dayTasks.map(task => (
              <TouchableOpacity
                key={task._id}
                style={styles.dayTask}
                onPress={() => openTaskDetails(task)}
              >
                <View style={[styles.taskPriorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  {task.description && (
                    <Text style={styles.taskDescription} numberOfLines={2}>{task.description}</Text>
                  )}
                  {task.project && (
                    <View style={styles.taskProject}>
                      <Ionicons name="folder" size={14} color={theme.colors.textLight} />
                      <Text style={styles.taskProjectName}>{task.project.name}</Text>
                    </View>
                  )}
                  <View style={styles.taskMeta}>
                    <View style={[styles.taskPriorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                      <Text style={styles.taskPriorityText}>{task.priority}</Text>
                    </View>
                    <View style={[styles.taskStatusBadge]}>
                      <Text style={styles.taskStatusText}>{task.status}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={goToPreviousPeriod} style={styles.navButton}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerDate}>{formatHeaderDate()}</Text>
            <TouchableOpacity onPress={goToNextPeriod} style={styles.navButton}>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* View mode selector */}
        <View style={styles.viewModeContainer}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'month' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('month')}
          >
            <Text style={[styles.viewModeText, viewMode === 'month' && styles.viewModeTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'week' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('week')}
          >
            <Text style={[styles.viewModeText, viewMode === 'week' && styles.viewModeTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'day' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('day')}
          >
            <Text style={[styles.viewModeText, viewMode === 'day' && styles.viewModeTextActive]}>
              Day
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calendar views */}
      <ScrollView
        style={styles.calendarContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </ScrollView>

      {/* Task Detail Modal */}
      <Modal
        visible={showTaskModal}
        animationType="slide"
        transparent
        onRequestClose={closeTaskModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Task Details</Text>
              <TouchableOpacity onPress={closeTaskModal}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {selectedTask && (
              <ScrollView style={styles.modalContent}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalTaskTitle}>{selectedTask.title}</Text>
                </View>

                {selectedTask.description && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Description</Text>
                    <Text style={styles.modalValue}>{selectedTask.description}</Text>
                  </View>
                )}

                {selectedTask.project && (
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Project</Text>
                    <View style={styles.modalProjectContainer}>
                      <Ionicons name="folder" size={20} color={theme.colors.primary} />
                      <Text style={styles.modalValue}>{selectedTask.project.name}</Text>
                    </View>
                  </View>
                )}

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Due Date</Text>
                  <Text style={styles.modalValue}>
                    {selectedTask.dueDate && new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Priority</Text>
                  <View style={[styles.modalPriorityBadge, { backgroundColor: getPriorityColor(selectedTask.priority) }]}>
                    <Text style={styles.modalPriorityText}>{selectedTask.priority.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Status</Text>
                  <Text style={styles.modalValue}>{selectedTask.status}</Text>
                </View>
              </ScrollView>
            )}
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
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    padding: 4,
  },
  headerDate: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  todayButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  todayButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  viewModeContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textLight,
  },
  viewModeTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  calendarContent: {
    flex: 1,
  },
  // Month view styles
  monthContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  weekHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    paddingVertical: 12,
  },
  weekDayHeader: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthDay: {
    width: '14.285%',
    aspectRatio: 1,
    padding: 4,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  monthDayInactive: {
    opacity: 0.3,
  },
  monthDayNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  monthDayNumberToday: {
    backgroundColor: theme.colors.primary,
  },
  monthDayNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  monthDayNumberTextToday: {
    color: '#fff',
  },
  monthDayTasks: {
    flex: 1,
  },
  monthTask: {
    padding: 2,
    borderRadius: 2,
    marginBottom: 2,
  },
  monthTaskText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: '600',
  },
  moreTasksText: {
    fontSize: 8,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  // Week view styles
  weekContainer: {
    flex: 1,
  },
  weekBody: {
    flexDirection: 'row',
    padding: 16,
  },
  weekDayNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  weekDayNumberToday: {
    backgroundColor: theme.colors.primary,
  },
  weekDayNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  weekDayNumberTextToday: {
    color: '#fff',
  },
  weekDayColumn: {
    flex: 1,
    paddingHorizontal: 2,
  },
  weekTask: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  weekTaskTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  weekTaskProject: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.8,
  },
  // Day view styles
  dayContainer: {
    flex: 1,
  },
  dayHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dayHeaderDate: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  dayHeaderTaskCount: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  dayTaskList: {
    padding: 16,
  },
  dayTask: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskPriorityIndicator: {
    width: 4,
  },
  taskContent: {
    flex: 1,
    padding: 16,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  taskProject: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  taskProjectName: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  taskPriorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  taskPriorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  taskStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: theme.colors.background,
  },
  taskStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginTop: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modalContent: {
    padding: 16,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalTaskTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  modalValue: {
    fontSize: 16,
    color: theme.colors.text,
  },
  modalProjectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalPriorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modalPriorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CalendarScreen;
