// Mock database for tasks
export const tasksDatabase = {
  1: [ // Website Redesign
    { id: 1, title: 'Design homepage mockup', description: 'Create new homepage design in Figma', status: 'completed', assignedTo: ['JD', 'SM'] },
    { id: 2, title: 'Implement navigation', description: 'Code the new navigation component', status: 'completed', assignedTo: ['SM'] },
    { id: 3, title: 'Optimize images', description: 'Compress and optimize all images', status: 'completed', assignedTo: ['AL'] },
    { id: 4, title: 'Add animations', description: 'Implement smooth scroll animations', status: 'in-progress', assignedTo: ['JD', 'AL'] },
    { id: 5, title: 'Mobile responsiveness', description: 'Make site responsive for mobile', status: 'in-progress', assignedTo: ['SM', 'JD'] },
    { id: 6, title: 'Browser testing', description: 'Test on all major browsers', status: 'completed', assignedTo: ['AL'] },
    { id: 7, title: 'SEO optimization', description: 'Add meta tags and optimize SEO', status: 'todo', assignedTo: ['JD'] },
    { id: 8, title: 'Performance audit', description: 'Run Lighthouse audit', status: 'todo', assignedTo: ['SM', 'AL'] },
    { id: 9, title: 'Content migration', description: 'Migrate old content to new design', status: 'completed', assignedTo: ['AL'] },
    { id: 10, title: 'Final review', description: 'Complete final review and launch', status: 'todo', assignedTo: ['JD', 'SM', 'AL'] }
  ],
  2: [ // Mobile App Development
    { id: 11, title: 'Setup project structure', description: 'Initialize React Native project', status: 'completed', assignedTo: ['KS'] },
    { id: 12, title: 'Design UI components', description: 'Create reusable UI components', status: 'completed', assignedTo: ['RJ', 'KS'] },
    { id: 13, title: 'Implement authentication', description: 'Add login and signup flow', status: 'todo', assignedTo: ['KS'] },
    { id: 14, title: 'API integration', description: 'Connect to backend APIs', status: 'todo', assignedTo: ['RJ'] },
    { id: 15, title: 'Push notifications', description: 'Setup push notification service', status: 'todo', assignedTo: ['KS'] },
    { id: 16, title: 'Offline mode', description: 'Implement offline functionality', status: 'todo', assignedTo: ['RJ', 'KS'] },
    { id: 17, title: 'Payment integration', description: 'Add payment gateway', status: 'todo', assignedTo: ['KS'] },
    { id: 18, title: 'Testing', description: 'Write unit and integration tests', status: 'todo', assignedTo: ['RJ'] },
    { id: 19, title: 'App store submission', description: 'Prepare for app store release', status: 'todo', assignedTo: ['KS'] },
    { id: 20, title: 'Documentation', description: 'Write user documentation', status: 'todo', assignedTo: ['RJ'] },
    { id: 21, title: 'Beta testing', description: 'Conduct beta testing phase', status: 'todo', assignedTo: ['KS', 'RJ'] },
    { id: 22, title: 'Bug fixes', description: 'Fix reported bugs', status: 'todo', assignedTo: ['RJ'] },
    { id: 23, title: 'Performance optimization', description: 'Optimize app performance', status: 'todo', assignedTo: ['KS'] },
    { id: 24, title: 'Security review', description: 'Complete security audit', status: 'todo', assignedTo: ['RJ'] },
    { id: 25, title: 'Launch', description: 'Official app launch', status: 'todo', assignedTo: ['KS', 'RJ'] }
  ],
  3: [ // Marketing Campaign
    { id: 26, title: 'Market research', description: 'Conduct target market analysis', status: 'completed', assignedTo: ['TW'] },
    { id: 27, title: 'Create content calendar', description: 'Plan content for 3 months', status: 'completed', assignedTo: ['BH', 'TW'] },
    { id: 28, title: 'Design social media assets', description: 'Create graphics for social media', status: 'completed', assignedTo: ['CN'] },
    { id: 29, title: 'Write blog posts', description: 'Write 10 blog posts', status: 'completed', assignedTo: ['PM', 'BH'] },
    { id: 30, title: 'Email campaign', description: 'Design and send email campaign', status: 'completed', assignedTo: ['TW'] },
    { id: 31, title: 'Social media ads', description: 'Run paid social media ads', status: 'completed', assignedTo: ['BH'] },
    { id: 32, title: 'Influencer outreach', description: 'Contact and collaborate with influencers', status: 'completed', assignedTo: ['CN', 'PM'] },
    { id: 33, title: 'Analytics tracking', description: 'Set up analytics and tracking', status: 'completed', assignedTo: ['PM'] }
  ],
  4: [ // Database Migration
    { id: 34, title: 'Backup current database', description: 'Create full database backup', status: 'completed', assignedTo: ['MK'] },
    { id: 35, title: 'Setup new database', description: 'Configure new database server', status: 'completed', assignedTo: ['LP', 'MK'] },
    { id: 36, title: 'Create migration scripts', description: 'Write data migration scripts', status: 'completed', assignedTo: ['MK'] },
    { id: 37, title: 'Test migration', description: 'Test migration on staging', status: 'completed', assignedTo: ['LP'] },
    { id: 38, title: 'Update application', description: 'Update app to use new database', status: 'completed', assignedTo: ['MK'] },
    { id: 39, title: 'Data validation', description: 'Validate migrated data', status: 'in-progress', assignedTo: ['LP', 'MK'] },
    { id: 40, title: 'Performance tuning', description: 'Optimize database performance', status: 'in-progress', assignedTo: ['MK'] },
    { id: 41, title: 'Update documentation', description: 'Document new database schema', status: 'completed', assignedTo: ['LP'] },
    { id: 42, title: 'Training', description: 'Train team on new database', status: 'todo', assignedTo: ['MK', 'LP'] },
    { id: 43, title: 'Monitoring setup', description: 'Setup database monitoring', status: 'in-progress', assignedTo: ['LP'] },
    { id: 44, title: 'Decommission old DB', description: 'Safely decommission old database', status: 'todo', assignedTo: ['MK'] },
    { id: 45, title: 'Final review', description: 'Complete final review', status: 'todo', assignedTo: ['LP', 'MK'] }
  ],
  5: [ // API Integration
    { id: 46, title: 'API documentation review', description: 'Review third-party API docs', status: 'completed', assignedTo: ['GH'] },
    { id: 47, title: 'Setup API keys', description: 'Obtain and configure API keys', status: 'completed', assignedTo: ['NP', 'GH'] },
    { id: 48, title: 'Create wrapper functions', description: 'Build API wrapper functions', status: 'completed', assignedTo: ['QR'] },
    { id: 49, title: 'Implement authentication', description: 'Add OAuth authentication', status: 'completed', assignedTo: ['GH'] },
    { id: 50, title: 'Data mapping', description: 'Map API data to internal models', status: 'completed', assignedTo: ['NP'] },
    { id: 51, title: 'Error handling', description: 'Implement error handling', status: 'completed', assignedTo: ['QR', 'NP'] },
    { id: 52, title: 'Rate limiting', description: 'Add rate limiting logic', status: 'completed', assignedTo: ['GH'] },
    { id: 53, title: 'Caching strategy', description: 'Implement API response caching', status: 'completed', assignedTo: ['NP'] },
    { id: 54, title: 'Unit tests', description: 'Write unit tests for API calls', status: 'completed', assignedTo: ['QR'] },
    { id: 55, title: 'Integration tests', description: 'Write integration tests', status: 'completed', assignedTo: ['GH', 'QR'] },
    { id: 56, title: 'Load testing', description: 'Perform load testing', status: 'completed', assignedTo: ['NP'] },
    { id: 57, title: 'Monitoring', description: 'Setup API monitoring', status: 'completed', assignedTo: ['QR'] },
    { id: 58, title: 'Documentation', description: 'Document API integration', status: 'completed', assignedTo: ['GH'] },
    { id: 59, title: 'Security audit', description: 'Complete security review', status: 'in-progress', assignedTo: ['NP', 'GH'] },
    { id: 60, title: 'Webhook setup', description: 'Configure webhooks', status: 'completed', assignedTo: ['QR'] },
    { id: 61, title: 'Fallback mechanisms', description: 'Add fallback for API failures', status: 'completed', assignedTo: ['GH'] },
    { id: 62, title: 'Performance optimization', description: 'Optimize API calls', status: 'in-progress', assignedTo: ['NP'] },
    { id: 63, title: 'Update UI', description: 'Update UI to use API data', status: 'in-progress', assignedTo: ['QR', 'NP'] },
    { id: 64, title: 'Final testing', description: 'Complete final testing', status: 'todo', assignedTo: ['GH', 'QR'] },
    { id: 65, title: 'Deploy to production', description: 'Deploy API integration', status: 'todo', assignedTo: ['NP'] }
  ],
  6: [ // User Testing Phase
    { id: 66, title: 'Recruit test users', description: 'Find and recruit beta testers', status: 'completed', assignedTo: ['YZ'] },
    { id: 67, title: 'Create test scenarios', description: 'Write user testing scenarios', status: 'todo', assignedTo: ['AB', 'YZ'] },
    { id: 68, title: 'Setup testing environment', description: 'Prepare testing environment', status: 'todo', assignedTo: ['YZ'] },
    { id: 69, title: 'Conduct tests', description: 'Run user testing sessions', status: 'todo', assignedTo: ['AB'] },
    { id: 70, title: 'Collect feedback', description: 'Gather user feedback', status: 'todo', assignedTo: ['YZ', 'AB'] },
    { id: 71, title: 'Analyze results', description: 'Analyze testing results', status: 'todo', assignedTo: ['AB'] }
  ],
  7: [ // Security Audit
    { id: 72, title: 'Code review', description: 'Review code for vulnerabilities', status: 'completed', assignedTo: ['CD'] },
    { id: 73, title: 'Penetration testing', description: 'Conduct penetration tests', status: 'completed', assignedTo: ['EF', 'CD'] },
    { id: 74, title: 'Dependency audit', description: 'Audit third-party dependencies', status: 'completed', assignedTo: ['GH'] },
    { id: 75, title: 'Authentication review', description: 'Review authentication mechanisms', status: 'completed', assignedTo: ['CD'] },
    { id: 76, title: 'Data encryption', description: 'Verify data encryption', status: 'completed', assignedTo: ['EF'] },
    { id: 77, title: 'Access control', description: 'Review access control policies', status: 'completed', assignedTo: ['GH', 'EF'] },
    { id: 78, title: 'SSL/TLS configuration', description: 'Verify SSL/TLS setup', status: 'completed', assignedTo: ['CD'] },
    { id: 79, title: 'Security headers', description: 'Check security headers', status: 'completed', assignedTo: ['EF'] },
    { id: 80, title: 'Fix vulnerabilities', description: 'Fix identified issues', status: 'completed', assignedTo: ['GH', 'CD'] },
    { id: 81, title: 'Final report', description: 'Prepare security audit report', status: 'completed', assignedTo: ['CD'] }
  ],
  8: [ // Content Management System
    { id: 82, title: 'Requirements gathering', description: 'Gather CMS requirements', status: 'completed', assignedTo: ['IJ'] },
    { id: 83, title: 'Database design', description: 'Design CMS database schema', status: 'completed', assignedTo: ['KL', 'IJ'] },
    { id: 84, title: 'Build content models', description: 'Create content type models', status: 'completed', assignedTo: ['MN'] },
    { id: 85, title: 'Admin interface', description: 'Build admin UI', status: 'completed', assignedTo: ['OP'] },
    { id: 86, title: 'Rich text editor', description: 'Integrate WYSIWYG editor', status: 'completed', assignedTo: ['IJ'] },
    { id: 87, title: 'Media manager', description: 'Build media upload and management', status: 'in-progress', assignedTo: ['KL', 'OP'] },
    { id: 88, title: 'User roles', description: 'Implement user roles and permissions', status: 'in-progress', assignedTo: ['MN'] },
    { id: 89, title: 'Content versioning', description: 'Add version control for content', status: 'completed', assignedTo: ['OP'] },
    { id: 90, title: 'API endpoints', description: 'Create REST API for content', status: 'in-progress', assignedTo: ['IJ', 'MN'] },
    { id: 91, title: 'Search functionality', description: 'Add content search', status: 'completed', assignedTo: ['KL'] },
    { id: 92, title: 'Workflow system', description: 'Build content approval workflow', status: 'in-progress', assignedTo: ['MN'] },
    { id: 93, title: 'Localization', description: 'Add multi-language support', status: 'todo', assignedTo: ['OP', 'IJ'] },
    { id: 94, title: 'SEO features', description: 'Add SEO optimization features', status: 'in-progress', assignedTo: ['IJ'] },
    { id: 95, title: 'Testing', description: 'Test CMS functionality', status: 'todo', assignedTo: ['KL', 'MN'] },
    { id: 96, title: 'Documentation', description: 'Write user documentation', status: 'todo', assignedTo: ['MN'] },
    { id: 97, title: 'Training', description: 'Train content team', status: 'todo', assignedTo: ['OP'] },
    { id: 98, title: 'Performance optimization', description: 'Optimize CMS performance', status: 'in-progress', assignedTo: ['IJ', 'KL'] },
    { id: 99, title: 'Launch', description: 'Launch CMS to production', status: 'todo', assignedTo: ['KL'] }
  ],
  9: [ // Analytics Dashboard
    { id: 100, title: 'Define metrics', description: 'Define key metrics to track', status: 'completed', assignedTo: ['QR'] },
    { id: 101, title: 'Design dashboard UI', description: 'Design dashboard layout', status: 'completed', assignedTo: ['ST', 'QR'] },
    { id: 102, title: 'Setup data pipeline', description: 'Build data collection pipeline', status: 'completed', assignedTo: ['QR'] },
    { id: 103, title: 'Create charts', description: 'Build interactive charts', status: 'todo', assignedTo: ['ST'] },
    { id: 104, title: 'Real-time updates', description: 'Add real-time data updates', status: 'todo', assignedTo: ['QR'] },
    { id: 105, title: 'Filters and segments', description: 'Add data filtering options', status: 'todo', assignedTo: ['ST', 'QR'] },
    { id: 106, title: 'Export functionality', description: 'Add data export features', status: 'todo', assignedTo: ['QR'] },
    { id: 107, title: 'User preferences', description: 'Save user dashboard preferences', status: 'todo', assignedTo: ['ST'] },
    { id: 108, title: 'Alerts system', description: 'Build alerts for key metrics', status: 'todo', assignedTo: ['QR'] },
    { id: 109, title: 'Mobile responsive', description: 'Make dashboard mobile-friendly', status: 'todo', assignedTo: ['ST'] },
    { id: 110, title: 'Performance optimization', description: 'Optimize dashboard performance', status: 'todo', assignedTo: ['QR', 'ST'] },
    { id: 111, title: 'Testing', description: 'Test dashboard functionality', status: 'todo', assignedTo: ['ST'] },
    { id: 112, title: 'Documentation', description: 'Document dashboard features', status: 'todo', assignedTo: ['QR'] },
    { id: 113, title: 'Launch', description: 'Launch analytics dashboard', status: 'todo', assignedTo: ['ST', 'QR'] }
  ]
};

// Helper function to get tasks for a project
export const getTasksForProject = (projectId) => {
  return tasksDatabase[projectId] || [];
};

// Helper function to get task statistics
export const getTaskStats = (projectId) => {
  const tasks = getTasksForProject(projectId);
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  
  return {
    total: tasks.length,
    completed,
    inProgress,
    todo
  };
};
