import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';

const TasksWidget = ({ tasks = [], loading = false }) => {
  const { t } = useTranslation();
  const [showCompleted, setShowCompleted] = useState(false);

  const mockTasks = tasks.length ? tasks : [
    {
      id: 1,
      title: 'FMD Vaccination - Herd A',
      description: '30 cattle due for booster',
      dueDate: '2024-03-20',
      priority: 'high',
      assignedTo: 'Dr. Molefe',
      status: 'pending',
      type: 'vaccination'
    },
    {
      id: 2,
      title: 'Fence Maintenance',
      description: 'East kraal fence repair',
      dueDate: '2024-03-18',
      priority: 'medium',
      assignedTo: 'Kagiso',
      status: 'in-progress',
      type: 'maintenance'
    },
    {
      id: 3,
      title: 'Feed Inventory Check',
      description: 'Monthly feed stock count',
      dueDate: '2024-03-22',
      priority: 'low',
      assignedTo: 'Modise',
      status: 'pending',
      type: 'inventory'
    },
    {
      id: 4,
      title: 'Deworming - Calves',
      description: '15 calves due for deworming',
      dueDate: '2024-03-15',
      priority: 'high',
      assignedTo: 'Self',
      status: 'completed',
      type: 'health'
    },
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'critical';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'vaccination': return 'vaccines';
      case 'maintenance': return 'build';
      case 'inventory': return 'inventory';
      case 'health': return 'medical_services';
      default: return 'task';
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const filteredTasks = showCompleted 
    ? mockTasks 
    : mockTasks.filter(t => t.status !== 'completed');

  const pendingCount = mockTasks.filter(t => t.status !== 'completed').length;

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-32 h-6 bg-sage-200 dark:bg-sage-800 rounded animate-pulse"></div>
          <div className="w-24 h-8 bg-sage-200 dark:bg-sage-800 rounded animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-sage-200 dark:bg-sage-800 rounded animate-pulse"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-sage-200 dark:border-sage-800">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-lg text-sage-900 dark:text-white">
            {t('dashboard.tasks') || 'Tasks & Reminders'}
          </h4>
          <Badge variant="warning" size="md">
            {pendingCount} {t('dashboard.pending') || 'Pending'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded border-sage-300 text-primary focus:ring-primary"
            />
            {t('dashboard.showCompleted') || 'Show completed'}
          </label>
          
          <Button variant="ghost" size="sm" icon="add" className="ml-auto">
            {t('common.add') || 'Add Task'}
          </Button>
        </div>
      </div>

      <div className="divide-y divide-sage-100 dark:divide-sage-800 max-h-[400px] overflow-y-auto">
        {filteredTasks.map(task => {
          const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
          
          return (
            <div
              key={task.id}
              className={`p-4 hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-colors ${
                task.status === 'completed' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  task.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
                  overdue ? 'bg-red-100 dark:bg-red-900/20' :
                  'bg-primary/10'
                }`}>
                  <span className={`material-icons-outlined ${
                    task.status === 'completed' ? 'text-green-600' :
                    overdue ? 'text-red-600' :
                    'text-primary'
                  }`}>
                    {task.status === 'completed' ? 'check_circle' : getTypeIcon(task.type)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="font-medium text-sage-900 dark:text-white">
                      {task.title}
                    </h5>
                    <Badge variant={getPriorityColor(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                  </div>

                  <p className="text-sm text-sage-600 dark:text-sage-400 mb-2">
                    {task.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-sage-500">
                      <span className="material-icons-outlined text-sm">person</span>
                      {task.assignedTo}
                    </div>
                    
                    <div className={`flex items-center gap-1 ${
                      overdue ? 'text-red-600 font-medium' : 'text-sage-500'
                    }`}>
                      <span className="material-icons-outlined text-sm">event</span>
                      {new Date(task.dueDate).toLocaleDateString()}
                      {overdue && ` (${t('common.overdue') || 'Overdue'})`}
                    </div>

                    {task.status === 'in-progress' && (
                      <Badge variant="info" size="sm">
                        {t('common.inProgress') || 'In Progress'}
                      </Badge>
                    )}
                  </div>
                </div>

                <button className="p-2 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-full transition-colors">
                  <span className="material-icons-outlined text-sage-400 text-sm">more_vert</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-8 text-center text-sage-500">
            <span className="material-icons-outlined text-4xl mb-2">task_alt</span>
            <p>{t('dashboard.noTasks') || 'No tasks found'}</p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-sage-50 dark:bg-sage-900/20 border-t border-sage-200 dark:border-sage-800">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={() => navigate('/tasks')}
          icon="arrow_forward"
          iconPosition="right"
        >
          {t('dashboard.seeAllTasks') || 'See all pending tasks'}
        </Button>
      </div>
    </Card>
  );
};

TasksWidget.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      description: PropTypes.string,
      dueDate: PropTypes.string,
      priority: PropTypes.string,
      assignedTo: PropTypes.string,
      status: PropTypes.string,
      type: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
};

export default TasksWidget;