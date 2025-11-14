const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Smart Notification Service
 * Centralized service for creating intelligent, context-aware notifications
 */

class NotificationService {
  /**
   * Create a notification for task assignment
   */
  static async notifyTaskAssigned(taskId, taskName, assignedTo, assignedBy, projectId) {
    try {
      if (assignedTo.toString() === assignedBy.toString()) {
        return null; // Don't notify if user assigns task to themselves
      }

      const assigner = await User.findById(assignedBy).select('name');
      
      return await Notification.create({
        title: 'New Task Assigned',
        message: `${assigner?.name || 'Someone'} assigned you the task "${taskName}"`,
        type: 'task_assigned',
        priority: 'medium',
        userId: assignedTo,
        actionBy: assignedBy,
        relatedId: taskId,
        relatedModel: 'Task',
        actionUrl: `/projects/${projectId}`,
        metadata: {
          taskId,
          taskName,
          projectId
        }
      });
    } catch (error) {
      console.error('Error creating task assigned notification:', error);
      return null;
    }
  }

  /**
   * Create a notification for task completion
   */
  static async notifyTaskCompleted(taskId, taskName, completedBy, projectOwnerId, projectId) {
    try {
      if (completedBy.toString() === projectOwnerId.toString()) {
        return null; // Don't notify if project owner completes their own task
      }

      const completer = await User.findById(completedBy).select('name');
      
      return await Notification.create({
        title: 'Task Completed',
        message: `${completer?.name || 'Someone'} completed the task "${taskName}"`,
        type: 'task_completed',
        priority: 'low',
        userId: projectOwnerId,
        actionBy: completedBy,
        relatedId: taskId,
        relatedModel: 'Task',
        actionUrl: `/projects/${projectId}`,
        metadata: {
          taskId,
          taskName,
          projectId
        }
      });
    } catch (error) {
      console.error('Error creating task completed notification:', error);
      return null;
    }
  }

  /**
   * Create notifications for overdue tasks
   */
  static async notifyTaskOverdue(taskId, taskName, assignedTo, projectId) {
    try {
      return await Notification.create({
        title: '⚠️ Task Overdue',
        message: `The task "${taskName}" is now overdue`,
        type: 'task_overdue',
        priority: 'urgent',
        userId: assignedTo,
        relatedId: taskId,
        relatedModel: 'Task',
        actionUrl: `/projects/${projectId}`,
        metadata: {
          taskId,
          taskName,
          projectId
        }
      });
    } catch (error) {
      console.error('Error creating task overdue notification:', error);
      return null;
    }
  }

  /**
   * Create notifications for tasks due soon (24 hours)
   */
  static async notifyTaskDueSoon(taskId, taskName, assignedTo, dueDate, projectId) {
    try {
      return await Notification.create({
        title: '⏰ Task Due Soon',
        message: `The task "${taskName}" is due soon`,
        type: 'task_due_soon',
        priority: 'high',
        userId: assignedTo,
        relatedId: taskId,
        relatedModel: 'Task',
        actionUrl: `/projects/${projectId}`,
        metadata: {
          taskId,
          taskName,
          dueDate,
          projectId
        }
      });
    } catch (error) {
      console.error('Error creating task due soon notification:', error);
      return null;
    }
  }

  /**
   * Create notification for task comment
   */
  static async notifyTaskComment(taskId, taskName, commentedBy, assignedTo, projectId, commentText) {
    try {
      if (commentedBy.toString() === assignedTo.toString()) {
        return null; // Don't notify if user comments on their own task
      }

      const commenter = await User.findById(commentedBy).select('name');
      
      return await Notification.create({
        title: '💬 New Comment',
        message: `${commenter?.name || 'Someone'} commented on "${taskName}"`,
        type: 'task_commented',
        priority: 'medium',
        userId: assignedTo,
        actionBy: commentedBy,
        relatedId: taskId,
        relatedModel: 'Task',
        actionUrl: `/projects/${projectId}`,
        metadata: {
          taskId,
          taskName,
          projectId,
          commentPreview: commentText.substring(0, 100)
        }
      });
    } catch (error) {
      console.error('Error creating task comment notification:', error);
      return null;
    }
  }

  /**
   * Create notification for project creation with collaborators
   */
  static async notifyProjectCreated(projectId, projectName, createdBy, collaborators) {
    try {
      const creator = await User.findById(createdBy).select('name');
      const notifications = [];

      for (const collab of collaborators) {
        const userId = collab.userId || collab;
        
        if (userId.toString() === createdBy.toString()) {
          continue; // Skip creator
        }

        const notification = await Notification.create({
          title: '🎉 Added to Project',
          message: `${creator?.name || 'Someone'} added you to project "${projectName}"`,
          type: 'project_created',
          priority: 'medium',
          userId,
          actionBy: createdBy,
          relatedId: projectId,
          relatedModel: 'Project',
          actionUrl: `/projects/${projectId}`,
          metadata: {
            projectId,
            projectName,
            role: collab.role || 'Editor'
          }
        });
        
        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      console.error('Error creating project created notifications:', error);
      return [];
    }
  }

  /**
   * Create notification when collaborator is added
   */
  static async notifyCollaboratorAdded(projectId, projectName, addedBy, newCollaboratorId, role) {
    try {
      if (addedBy.toString() === newCollaboratorId.toString()) {
        return null; // Don't notify if user adds themselves
      }

      const adder = await User.findById(addedBy).select('name');
      
      return await Notification.create({
        title: '👋 Welcome to Project',
        message: `${adder?.name || 'Someone'} added you to "${projectName}" as ${role}`,
        type: 'collaborator_added',
        priority: 'medium',
        userId: newCollaboratorId,
        actionBy: addedBy,
        relatedId: projectId,
        relatedModel: 'Project',
        actionUrl: `/projects/${projectId}`,
        metadata: {
          projectId,
          projectName,
          role
        }
      });
    } catch (error) {
      console.error('Error creating collaborator added notification:', error);
      return null;
    }
  }

  /**
   * Create notification when mentioned in a comment
   */
  static async notifyMention(mentionedUserId, mentionedBy, context, contextId, contextType, projectId) {
    try {
      if (mentionedUserId.toString() === mentionedBy.toString()) {
        return null; // Don't notify if user mentions themselves
      }

      const mentioner = await User.findById(mentionedBy).select('name');
      
      return await Notification.create({
        title: '👤 You were mentioned',
        message: `${mentioner?.name || 'Someone'} mentioned you in a ${contextType}`,
        type: 'mention',
        priority: 'high',
        userId: mentionedUserId,
        actionBy: mentionedBy,
        relatedId: contextId,
        relatedModel: contextType === 'comment' ? 'Comment' : 'Task',
        actionUrl: `/projects/${projectId}`,
        metadata: {
          contextType,
          contextId,
          projectId,
          preview: context.substring(0, 100)
        }
      });
    } catch (error) {
      console.error('Error creating mention notification:', error);
      return null;
    }
  }

  /**
   * Create notification for project deadline approaching
   */
  static async notifyDeadlineApproaching(projectId, projectName, ownerId, collaborators, daysLeft) {
    try {
      const notifications = [];
      const allUsers = [ownerId, ...collaborators.map(c => c.userId || c)];

      for (const userId of allUsers) {
        const notification = await Notification.create({
          title: '📅 Deadline Approaching',
          message: `Project "${projectName}" deadline is in ${daysLeft} days`,
          type: 'deadline_approaching',
          priority: daysLeft <= 1 ? 'urgent' : 'high',
          userId,
          relatedId: projectId,
          relatedModel: 'Project',
          actionUrl: `/projects/${projectId}`,
          metadata: {
            projectId,
            projectName,
            daysLeft
          }
        });
        
        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      console.error('Error creating deadline approaching notifications:', error);
      return [];
    }
  }

  /**
   * Notify all project collaborators
   */
  static async notifyProjectCollaborators(projectId, projectName, ownerId, collaborators, title, message, type, priority = 'medium') {
    try {
      const notifications = [];
      const allUsers = [ownerId, ...collaborators.map(c => c.userId || c)];

      for (const userId of allUsers) {
        const notification = await Notification.create({
          title,
          message,
          type: type || 'project_updated',
          priority,
          userId,
          relatedId: projectId,
          relatedModel: 'Project',
          actionUrl: `/projects/${projectId}`,
          metadata: {
            projectId,
            projectName
          }
        });
        
        notifications.push(notification);
      }

      return notifications;
    } catch (error) {
      console.error('Error notifying project collaborators:', error);
      return [];
    }
  }

  /**
   * Delete old read notifications (cleanup utility)
   */
  static async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.deleteMany({
        isRead: true,
        createdAt: { $lt: cutoffDate }
      });

      console.log(`Cleaned up ${result.deletedCount} old notifications`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      return 0;
    }
  }
}

module.exports = NotificationService;
