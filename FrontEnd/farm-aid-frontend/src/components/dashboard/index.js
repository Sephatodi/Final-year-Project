// Dashboard components index file
import SummaryCards from './SummaryCards';
import HealthChart from './HealthChart';
import RecentActivities from './RecentActivities';
import AlertsWidget from './AlertsWidget';
import TasksWidget from './TasksWidget';
import WeatherWidget from './WeatherWidget';
import QuickActions from './QuickActions';
// Dashboard components index file
export { default as StatCard } from './StatCard';
export { default as EducationalTooltip } from './EducationalTooltip';

// Re-export all dashboard components as a single object
const DashboardComponents = {
  SummaryCards,
  HealthChart,
  RecentActivities,
  AlertsWidget,
  TasksWidget,
  WeatherWidget,
  QuickActions,
};

export default DashboardComponents;