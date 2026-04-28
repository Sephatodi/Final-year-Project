import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Heart,
  Activity,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PieChart,
  LineChart,
  Download,
  Filter,
  ChevronDown
} from 'lucide-react';
import livestockService from '../services/livestockService';
import reportService from '../services/reportService';

const HerdAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('month'); // week, month, year
  const [herdStats, setHerdStats] = useState({
    totalAnimals: 24,
    healthyAnimals: 20,
    sickAnimals: 3,
    atRisk: 1,
    avgAge: 4.5,
    avgWeight: 420,
    productivityRate: 87
  });

  const [healthTrends, setHealthTrends] = useState([
    { date: 'Mon', healthy: 22, sick: 2, risk: 0 },
    { date: 'Tue', healthy: 21, sick: 2, risk: 1 },
    { date: 'Wed', healthy: 20, sick: 3, risk: 1 },
    { date: 'Thu', healthy: 20, sick: 3, risk: 1 },
    { date: 'Fri', healthy: 19, sick: 4, risk: 1 },
    { date: 'Sat', healthy: 20, sick: 3, risk: 1 },
    { date: 'Sun', healthy: 20, sick: 3, risk: 1 }
  ]);

  const [breedDistribution, setBreedDistribution] = useState([
    { breed: 'Brahman', count: 8, percentage: 33 },
    { breed: 'Nguni', count: 7, percentage: 29 },
    { breed: 'Simmental', count: 5, percentage: 21 },
    { breed: 'Other', count: 4, percentage: 17 }
  ]);

  const [expenseData, setExpenseData] = useState([
    { category: 'Feed', amount: 4200, percentage: 45 },
    { category: 'Veterinary', amount: 2100, percentage: 22 },
    { category: 'Housing', amount: 1800, percentage: 19 },
    { category: 'Other', amount: 900, percentage: 14 }
  ]);

  const [recentEvents, setRecentEvents] = useState([
    { id: 1, type: 'health', animal: 'Bessie', event: 'Symptoms recorded - Fever', date: '2 hours ago', severity: 'high' },
    { id: 2, type: 'vaccination', animal: 'Moo Jr', event: 'Annual vaccination completed', date: '1 day ago', severity: 'info' },
    { id: 3, type: 'expense', animal: 'Herd', event: 'Feed purchase: P2,800', date: '3 days ago', severity: 'normal' },
    { id: 4, type: 'reproduction', animal: 'Daisy', event: 'In-calf status updated', date: '5 days ago', severity: 'info' },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // In production, call actual services
      // const stats = await livestockService.getHerdStats({ timeRange });
      // setHerdStats(stats);
      
      // Simulating data for now
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    // Generate and download report
    const report = {
      title: 'Herd Analytics Report',
      generatedDate: new Date().toLocaleDateString(),
      timeRange,
      stats: herdStats,
      trends: healthTrends,
      breeds: breedDistribution,
      expenses: expenseData
    };

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2)));
    element.setAttribute('download', `herd-report-${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#ea580c] p-3 rounded-xl text-white">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Herd Analytics</h1>
                <p className="text-sm text-gray-500">Comprehensive insights into your livestock health and productivity</p>
              </div>
            </div>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 bg-[#ea580c] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#c44e13] transition-all"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          {/* Time Range Filter */}
          <div className="flex gap-2">
            {['week', 'month', 'year'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  timeRange === range
                    ? 'bg-[#ea580c] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Animals', value: herdStats.totalAnimals, icon: Activity, color: 'blue' },
            { label: 'Healthy', value: herdStats.healthyAnimals, icon: CheckCircle2, color: 'green' },
            { label: 'Health Issues', value: herdStats.sickAnimals, icon: Heart, color: 'red' },
            { label: 'Productivity', value: `${herdStats.productivityRate}%`, icon: TrendingUp, color: 'purple' }
          ].map((metric, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm text-gray-500 font-bold">{metric.label}</span>
                <div className={`p-2 rounded-lg ${
                  metric.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  metric.color === 'green' ? 'bg-green-100 text-green-600' :
                  metric.color === 'red' ? 'bg-red-100 text-red-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <metric.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Health Trends */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900">Health Trends</h3>
              <LineChart className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {healthTrends.map((day, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-500 w-8">{day.date}</span>
                  <div className="flex-1 flex gap-1 h-8">
                    <div
                      className="bg-green-500 rounded"
                      style={{ flex: day.healthy, minWidth: '0%' }}
                      title={`Healthy: ${day.healthy}`}
                    />
                    <div
                      className="bg-red-400 rounded"
                      style={{ flex: day.sick, minWidth: '0%' }}
                      title={`Sick: ${day.sick}`}
                    />
                    <div
                      className="bg-yellow-400 rounded"
                      style={{ flex: day.risk, minWidth: '0%' }}
                      title={`At Risk: ${day.risk}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-12 text-right">{day.healthy + day.sick + day.risk}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs font-bold text-gray-600">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span className="text-xs font-bold text-gray-600">Sick</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span className="text-xs font-bold text-gray-600">At Risk</span>
              </div>
            </div>
          </div>

          {/* Breed Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-900">Breed Distribution</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {breedDistribution.map((breed, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{breed.breed}</span>
                    <span className="text-sm font-bold text-gray-600">{breed.count} animals ({breed.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        i === 0 ? 'bg-blue-600' :
                        i === 1 ? 'bg-green-600' :
                        i === 2 ? 'bg-purple-600' :
                        'bg-amber-600'
                      }`}
                      style={{ width: `${breed.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#ea580c]" />
            Expenses Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {expenseData.map((expense, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">{expense.category}</span>
                  <span className="text-xs font-bold text-gray-500">{expense.percentage}%</span>
                </div>
                <div className="text-2xl font-black text-[#ea580c] mb-2">P{expense.amount.toLocaleString()}</div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ea580c] rounded-full"
                    style={{ width: `${expense.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-right">
            <div className="text-sm text-gray-600 mb-1">Monthly Total Expenses</div>
            <div className="text-3xl font-black text-gray-900">
              P{expenseData.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#ea580c]" />
            Recent Activity
          </h3>

          <div className="space-y-3">
            {recentEvents.map(event => (
              <div key={event.id} className={`flex items-start gap-4 p-4 rounded-lg border ${
                event.severity === 'high' ? 'bg-red-50 border-red-200' :
                event.severity === 'info' ? 'bg-blue-50 border-blue-200' :
                'bg-slate-50 border-gray-200'
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  event.type === 'health' ? 'bg-red-100 text-red-600' :
                  event.type === 'vaccination' ? 'bg-green-100 text-green-600' :
                  event.type === 'expense' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {event.type === 'health' && <AlertTriangle className="w-5 h-5" />}
                  {event.type === 'vaccination' && <CheckCircle2 className="w-5 h-5" />}
                  {event.type === 'expense' && <DollarSign className="w-5 h-5" />}
                  {event.type === 'reproduction' && <Activity className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{event.animal}</h4>
                      <p className="text-sm text-gray-700 mt-1">{event.event}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-500 whitespace-nowrap">{event.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HerdAnalyticsDashboard;
