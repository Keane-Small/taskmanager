const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

// Get productivity analytics
router.get('/productivity', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all completed tasks from the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const completedTasks = await Task.find({
      assignedTo: userId,
      status: 'completed',
      completedAt: { $gte: ninetyDaysAgo }
    });

    // Analyze productivity by day of week
    const dayStats = {
      0: { name: 'Sunday', completed: 0, totalTime: 0 },
      1: { name: 'Monday', completed: 0, totalTime: 0 },
      2: { name: 'Tuesday', completed: 0, totalTime: 0 },
      3: { name: 'Wednesday', completed: 0, totalTime: 0 },
      4: { name: 'Thursday', completed: 0, totalTime: 0 },
      5: { name: 'Friday', completed: 0, totalTime: 0 },
      6: { name: 'Saturday', completed: 0, totalTime: 0 }
    };

    completedTasks.forEach(task => {
      const dayOfWeek = new Date(task.completedAt).getDay();
      dayStats[dayOfWeek].completed++;
      
      // Calculate time spent (difference between creation and completion)
      if (task.completedAt && task.createdAt) {
        const timeSpent = (new Date(task.completedAt) - new Date(task.createdAt)) / (1000 * 60 * 60); // hours
        dayStats[dayOfWeek].totalTime += timeSpent;
      }
    });

    // Find most productive day
    let mostProductiveDay = null;
    let maxCompleted = 0;
    let avgCompleted = 0;

    Object.values(dayStats).forEach(day => {
      avgCompleted += day.completed;
      if (day.completed > maxCompleted) {
        maxCompleted = day.completed;
        mostProductiveDay = day.name;
      }
    });

    avgCompleted = avgCompleted / 7;
    const productivityIncrease = avgCompleted > 0 
      ? Math.round(((maxCompleted - avgCompleted) / avgCompleted) * 100)
      : 0;

    // Calculate overall productivity metrics
    const totalTasksThisWeek = await Task.countDocuments({
      assignedTo: userId,
      status: 'completed',
      completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const totalTasksLastWeek = await Task.countDocuments({
      assignedTo: userId,
      status: 'completed',
      completedAt: { 
        $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    });

    const weekOverWeekChange = totalTasksLastWeek > 0
      ? Math.round(((totalTasksThisWeek - totalTasksLastWeek) / totalTasksLastWeek) * 100)
      : 0;

    res.json({
      mostProductiveDay,
      productivityIncrease,
      dayStats: Object.values(dayStats),
      weekOverWeekChange,
      totalTasksThisWeek,
      totalTasksCompleted: completedTasks.length
    });
  } catch (error) {
    console.error('Error getting productivity analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get smart deadline suggestions
router.get('/deadline-suggestions', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's task completion history
    const completedTasks = await Task.find({
      assignedTo: userId,
      status: 'completed',
      completedAt: { $exists: true }
    }).limit(100);

    // Calculate average completion time by priority
    const avgTimeByPriority = {
      low: [],
      medium: [],
      high: [],
      urgent: []
    };

    completedTasks.forEach(task => {
      if (task.completedAt && task.createdAt) {
        const timeSpent = (new Date(task.completedAt) - new Date(task.createdAt)) / (1000 * 60 * 60 * 24); // days
        const priority = task.priority || 'medium';
        avgTimeByPriority[priority].push(timeSpent);
      }
    });

    // Calculate averages
    const suggestions = {};
    Object.keys(avgTimeByPriority).forEach(priority => {
      const times = avgTimeByPriority[priority];
      if (times.length > 0) {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        suggestions[priority] = Math.ceil(avg);
      } else {
        // Default suggestions if no history
        suggestions[priority] = priority === 'urgent' ? 1 : priority === 'high' ? 3 : priority === 'medium' ? 7 : 14;
      }
    });

    // Get pending tasks that need deadline suggestions
    const tasksWithoutDeadlines = await Task.find({
      assignedTo: userId,
      status: { $in: ['pending', 'in-progress'] },
      $or: [
        { dueDate: { $exists: false } },
        { dueDate: null }
      ]
    }).limit(10);

    const recommendedDeadlines = tasksWithoutDeadlines.map(task => {
      const priority = task.priority || 'medium';
      const suggestedDays = suggestions[priority];
      const suggestedDate = new Date();
      suggestedDate.setDate(suggestedDate.getDate() + suggestedDays);

      return {
        taskId: task._id,
        taskTitle: task.title,
        priority: task.priority,
        suggestedDeadline: suggestedDate,
        suggestedDays,
        confidence: Math.min(95, 60 + (avgTimeByPriority[priority].length * 2)) // Higher confidence with more data
      };
    });

    res.json({
      suggestions,
      recommendedDeadlines,
      completionHistory: completedTasks.length
    });
  } catch (error) {
    console.error('Error getting deadline suggestions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get workload balancing recommendations
router.get('/workload-balance', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all active tasks
    const activeTasks = await Task.find({
      assignedTo: userId,
      status: { $in: ['pending', 'in-progress'] }
    }).populate('project');

    // Get all projects the user is part of
    const projects = await Project.find({
      $or: [
        { createdBy: userId },
        { 'collaborators.user': userId }
      ]
    });

    // Analyze workload by project
    const projectWorkload = {};
    projects.forEach(project => {
      projectWorkload[project._id] = {
        projectName: project.name,
        projectId: project._id,
        tasks: 0,
        urgentTasks: 0,
        estimatedHours: 0
      };
    });

    activeTasks.forEach(task => {
      if (task.project && projectWorkload[task.project._id]) {
        projectWorkload[task.project._id].tasks++;
        if (task.priority === 'urgent' || task.priority === 'high') {
          projectWorkload[task.project._id].urgentTasks++;
        }
        // Estimate hours based on priority
        const hourEstimate = task.priority === 'urgent' ? 4 : task.priority === 'high' ? 6 : task.priority === 'medium' ? 8 : 10;
        projectWorkload[task.project._id].estimatedHours += hourEstimate;
      }
    });

    // Calculate total workload
    const totalTasks = activeTasks.length;
    const totalHours = Object.values(projectWorkload).reduce((sum, p) => sum + p.estimatedHours, 0);

    // Identify overloaded projects (more than 40 hours estimated)
    const overloadedProjects = Object.values(projectWorkload)
      .filter(p => p.estimatedHours > 40)
      .sort((a, b) => b.estimatedHours - a.estimatedHours);

    // Generate recommendations
    const recommendations = [];
    
    if (totalHours > 80) {
      recommendations.push({
        type: 'critical',
        message: `You have ${totalHours} estimated hours of work. Consider delegating or postponing non-urgent tasks.`,
        action: 'delegate'
      });
    }

    overloadedProjects.forEach(project => {
      recommendations.push({
        type: 'warning',
        message: `Project "${project.projectName}" has ${project.tasks} tasks (${project.estimatedHours}h estimated). Consider redistributing work.`,
        projectId: project.projectId,
        action: 'redistribute'
      });
    });

    // Check for tasks without due dates
    const tasksWithoutDueDates = activeTasks.filter(t => !t.dueDate).length;
    if (tasksWithoutDueDates > 5) {
      recommendations.push({
        type: 'info',
        message: `${tasksWithoutDueDates} tasks don't have deadlines. Setting deadlines helps with workload planning.`,
        action: 'set_deadlines'
      });
    }

    // Workload distribution status
    let balanceStatus = 'balanced';
    if (totalHours > 80) {
      balanceStatus = 'overloaded';
    } else if (totalHours < 20) {
      balanceStatus = 'underutilized';
    }

    res.json({
      totalTasks,
      totalHours,
      balanceStatus,
      projectWorkload: Object.values(projectWorkload),
      recommendations,
      tasksWithoutDueDates
    });
  } catch (error) {
    console.error('Error getting workload balance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get risk predictions for projects
router.get('/risk-prediction', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all projects the user is involved in
    const projects = await Project.find({
      $or: [
        { createdBy: userId },
        { 'collaborators.user': userId }
      ]
    });

    const riskAnalysis = await Promise.all(projects.map(async (project) => {
      // Get all tasks for this project
      const allTasks = await Task.find({ project: project._id });
      const completedTasks = allTasks.filter(t => t.status === 'completed');
      const overdueTasks = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed');
      const totalTasks = allTasks.length;

      if (totalTasks === 0) {
        return null; // Skip projects with no tasks
      }

      // Calculate risk factors
      let riskScore = 0;
      const riskFactors = [];

      // Factor 1: Overdue tasks (0-40 points)
      const overduePercentage = (overdueTasks.length / totalTasks) * 100;
      if (overduePercentage > 0) {
        const overdueRisk = Math.min(40, overduePercentage * 2);
        riskScore += overdueRisk;
        riskFactors.push({
          factor: 'Overdue Tasks',
          impact: Math.round(overdueRisk),
          description: `${overdueTasks.length} tasks are overdue`
        });
      }

      // Factor 2: Completion rate (0-30 points)
      const completionRate = (completedTasks.length / totalTasks) * 100;
      if (completionRate < 50) {
        const completionRisk = 30 - (completionRate * 0.6);
        riskScore += completionRisk;
        riskFactors.push({
          factor: 'Low Completion Rate',
          impact: Math.round(completionRisk),
          description: `Only ${Math.round(completionRate)}% of tasks completed`
        });
      }

      // Factor 3: Upcoming deadlines (0-30 points)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const upcomingTasks = allTasks.filter(t => 
        t.dueDate && 
        new Date(t.dueDate) <= nextWeek && 
        new Date(t.dueDate) >= new Date() &&
        t.status !== 'completed'
      );
      const upcomingPercentage = (upcomingTasks.length / totalTasks) * 100;
      if (upcomingPercentage > 30) {
        const upcomingRisk = Math.min(30, (upcomingPercentage - 30) * 1.5);
        riskScore += upcomingRisk;
        riskFactors.push({
          factor: 'High Upcoming Workload',
          impact: Math.round(upcomingRisk),
          description: `${upcomingTasks.length} tasks due within 7 days`
        });
      }

      // Calculate final delay probability
      const delayProbability = Math.min(99, Math.round(riskScore));
      
      let riskLevel = 'low';
      if (delayProbability >= 70) riskLevel = 'critical';
      else if (delayProbability >= 50) riskLevel = 'high';
      else if (delayProbability >= 30) riskLevel = 'medium';

      return {
        projectId: project._id,
        projectName: project.name,
        delayProbability,
        riskLevel,
        riskFactors,
        totalTasks,
        completedTasks: completedTasks.length,
        overdueTasks: overdueTasks.length,
        completionRate: Math.round(completionRate)
      };
    }));

    // Filter out null entries and sort by risk
    const validRisks = riskAnalysis
      .filter(r => r !== null)
      .sort((a, b) => b.delayProbability - a.delayProbability);

    res.json({
      projects: validRisks,
      highRiskCount: validRisks.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length
    });
  } catch (error) {
    console.error('Error getting risk predictions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
