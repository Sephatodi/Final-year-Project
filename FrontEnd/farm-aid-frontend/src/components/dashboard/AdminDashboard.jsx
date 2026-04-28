import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('surveillance');

  // Mock data for outbreaks
  const outbreaks = [
    {
      id: 1,
      region: 'Francistown East',
      disease: 'FMD Type O',
      caseCount: 42,
      newCases: 5,
      status: 'critical',
      broadcast: 'Sent (2h ago)',
      latitude: -21.17,
      longitude: 27.51,
    },
    {
      id: 2,
      region: 'Gaborone North',
      disease: 'Heartwater',
      caseCount: 18,
      newCases: 2,
      status: 'warning',
      broadcast: 'Sent (5h ago)',
      latitude: -24.63,
      longitude: 25.92,
    },
    {
      id: 3,
      region: 'Maun Central',
      disease: 'Lumpy Skin',
      caseCount: 24,
      newCases: 3,
      status: 'warning',
      broadcast: 'Pending',
      latitude: -19.98,
      longitude: 23.42,
    },
    {
      id: 4,
      region: 'Kanye South',
      disease: 'Anthrax',
      caseCount: 7,
      newCases: 1,
      status: 'critical',
      broadcast: 'Sent (1h ago)',
      latitude: -24.98,
      longitude: 25.35,
    },
  ];

  const stats = {
    activeOutbreaks: 4,
    activeOutbreaksTrend: 12,
    verifiedCases: 112,
    unverifiedReports: 28,
    cattleCases: 78,
    smallRuminants: 34,
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'critical':
        return <Badge variant="critical" size="md">CRITICAL</Badge>;
      case 'warning':
        return <Badge variant="warning" size="md">WARNING</Badge>;
      default:
        return <Badge variant="info" size="md">MONITORING</Badge>;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-amber-600';
      default: return 'text-blue-600';
    }
  };

  const filteredOutbreaks = outbreaks.filter(outbreak =>
    outbreak.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    outbreak.disease.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="border-b border-sage-200 dark:border-sage-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-sage-900 dark:text-white">Farm-Aid PWA</h1>
              <p className="text-sm text-primary font-semibold">ADMINISTRATOR</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-sage-500">AGRO HAVEN FARM</span>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-icons-outlined text-primary">admin_panel_settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-sage-200 dark:border-sage-800">
          <button
            onClick={() => setActiveTab('surveillance')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'surveillance'
                ? 'text-primary border-b-2 border-primary'
                : 'text-sage-500 hover:text-sage-700'
            }`}
          >
            <span className="material-icons-outlined align-middle mr-2 text-sm">dashboard</span>
            Admin Home
          </button>
          <button
            onClick={() => setActiveTab('disease')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'disease'
                ? 'text-primary border-b-2 border-primary'
                : 'text-sage-500 hover:text-sage-700'
            }`}
          >
            <span className="material-icons-outlined align-middle mr-2 text-sm">coronavirus</span>
            Disease Monitoring
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-primary border-b-2 border-primary'
                : 'text-sage-500 hover:text-sage-700'
            }`}
          >
            <span className="material-icons-outlined align-middle mr-2 text-sm">people</span>
            User Management
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'knowledge'
                ? 'text-primary border-b-2 border-primary'
                : 'text-sage-500 hover:text-sage-700'
            }`}
          >
            <span className="material-icons-outlined align-middle mr-2 text-sm">menu_book</span>
            Knowledge Base
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Input
            placeholder="Search Francistown regions or cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="search"
            className="max-w-md"
            fullWidth={false}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sage-500 text-sm font-medium">Active Outbreaks</span>
              <span className="text-green-600 text-sm flex items-center gap-1">
                <span className="material-icons-outlined text-sm">trending_up</span>
                +{stats.activeOutbreaksTrend}% vs last month
              </span>
            </div>
            <div className="text-3xl font-bold text-sage-900 dark:text-white">{stats.activeOutbreaks}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sage-500 text-sm font-medium">Verified Cases</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.verifiedCases}</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sage-500 text-sm font-medium">Unverified Reports</span>
            </div>
            <div className="text-3xl font-bold text-amber-600">{stats.unverifiedReports}</div>
            <p className="text-xs text-sage-500 mt-2">AI-flagged reports awaiting review</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sage-500 text-sm font-medium">Cases by Species</span>
            </div>
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold text-sage-900">{stats.cattleCases}</div>
                <div className="text-xs text-sage-500">Cattle</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sage-900">{stats.smallRuminants}</div>
                <div className="text-xs text-sage-500">Goats/Sheep</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Map and Priority Alert Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Map Section */}
          <Card className="lg:col-span-2 overflow-hidden">
            <div className="p-6 border-b border-sage-200 dark:border-sage-800">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Francistown Disease Surveillance Map</h3>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span>High Severity Outbreak</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span>Active Monitoring Zone</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>Reported Suspected Case</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] bg-sage-100 dark:bg-sage-800">
              {/* Map Placeholder */}
              <div className="absolute inset-0 p-4">
                <div className="relative w-full h-full bg-white dark:bg-sage-900 rounded-lg shadow-inner">
                  {/* Map Grid */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle, #4c9a66 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }} />
                  
                  {/* Map Markers */}
                  {outbreaks.map(outbreak => (
                    <div
                      key={outbreak.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                      style={{
                        left: `${((outbreak.longitude + 180) / 360) * 100}%`,
                        top: `${((90 - outbreak.latitude) / 180) * 100}%`,
                      }}
                    >
                      <div className={`relative w-4 h-4 rounded-full ${
                        outbreak.status === 'critical' ? 'bg-red-500 animate-pulse' :
                        outbreak.status === 'warning' ? 'bg-amber-500' :
                        'bg-blue-500'
                      } shadow-lg`}>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-sage-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {outbreak.region}: {outbreak.caseCount} cases
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Scale Bar */}
                  <div className="absolute bottom-4 right-4 bg-white dark:bg-sage-800 px-3 py-1.5 rounded text-xs shadow">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-0.5 bg-sage-600"></div>
                      <span>50 km</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Priority Alert Card */}
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3 mb-4">
              <span className="material-icons-outlined text-red-600 text-3xl">warning</span>
              <div>
                <h3 className="font-bold text-red-800 dark:text-red-300">Priority Alert</h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  AI-flagged reports awaiting veterinary review. Priority: High in North-East District.
                </p>
              </div>
            </div>
            <Button
              variant="danger"
              className="w-full mt-4"
              icon="bolt"
            >
              Launch AI Triage
            </Button>
          </Card>
        </div>

        {/* Regional Alert List */}
        <Card className="overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-sage-200 dark:border-sage-800">
            <h3 className="font-bold text-lg">Regional Alert List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-sage-50 dark:bg-sage-900/20 text-sage-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 text-left">REGION</th>
                  <th className="px-6 py-4 text-left">REPORTED DISEASE</th>
                  <th className="px-6 py-4 text-left">CASE COUNT</th>
                  <th className="px-6 py-4 text-left">STATUS</th>
                  <th className="px-6 py-4 text-left">BROADCAST</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-sage-100 dark:divide-sage-800">
                {filteredOutbreaks.map(outbreak => (
                  <tr key={outbreak.id} className="hover:bg-sage-50/50 dark:hover:bg-sage-900/10 transition-colors">
                    <td className="px-6 py-4 font-medium">{outbreak.region}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {outbreak.disease}
                        {outbreak.disease === 'FMD Type O' && (
                          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Highly Contagious</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{outbreak.caseCount}</span>
                        {outbreak.newCases > 0 && (
                          <span className="text-xs text-red-600">(+{outbreak.newCases} today)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(outbreak.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${outbreak.broadcast === 'Pending' ? 'text-amber-600' : 'text-green-600'}`}>
                          {outbreak.broadcast}
                        </span>
                        {outbreak.broadcast === 'Pending' && (
                          <button className="text-primary text-sm hover:underline">
                            Send Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Action Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icons-outlined text-primary">campaign</span>
              <h3 className="font-bold text-lg">Action Center</h3>
            </div>
            <Button
              variant="danger"
              className="w-full"
              icon="warning"
            >
              Initiate Emergency Broadcast
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icons-outlined text-primary">settings</span>
              <h3 className="font-bold text-lg">System Settings</h3>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-sage-800 rounded-lg flex items-center gap-2">
                <span className="material-icons-outlined text-sage-500">notifications</span>
                <span>Alert Preferences</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-sage-800 rounded-lg flex items-center gap-2">
                <span className="material-icons-outlined text-sage-500">sync</span>
                <span>Sync Settings</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-sage-50 dark:hover:bg-sage-800 rounded-lg flex items-center gap-2">
                <span className="material-icons-outlined text-sage-500">security</span>
                <span>Access Control</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;