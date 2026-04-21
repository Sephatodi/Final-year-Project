import React, { useState, useEffect } from 'react';
import { adminQueries } from '../../db/adminQueries';

const DiseaseReportsManagement = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const allReports = await adminQueries.getAllDiseaseReports();
      setReports(allReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, notes = '') => {
    try {
      const updatedReport = await adminQueries.updateReportStatus(id, status, notes);
      setReports(prev => prev.map(r => r.id === id ? updatedReport : r));
      setSelectedReport(null);
    } catch (error) {
      console.error('Failed to update report:', error);
      alert('Failed to update report');
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'verified': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold">Disease Reports Management</h3>
        <p className="text-sage-500 text-sm">Review and verify disease reports from farmers</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-sage-200 dark:border-sage-800">
        {['all', 'pending', 'submitted', 'verified', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-all ${
              filter === status
                ? 'border-b-2 border-primary text-primary'
                : 'text-sage-500 hover:text-sage-700'
            }`}
          >
            {status} ({reports.filter(r => status === 'all' ? true : r.status === status).length})
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map(report => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={`card p-4 cursor-pointer transition-all ${
                selectedReport?.id === report.id ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Report #{report.reportId?.slice(-8) || report.id.slice(-8)}</p>
                  <p className="text-xs text-sage-500">{new Date(report.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
              <p className="text-sm text-sage-600 dark:text-sage-400 mt-2 line-clamp-2">
                {report.description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="material-icons-outlined text-sage-400 text-sm">location_on</span>
                <span className="text-xs text-sage-500">{report.location || 'Location not specified'}</span>
              </div>
            </div>
          ))}
          
          {filteredReports.length === 0 && (
            <div className="card p-8 text-center text-sage-500">
              No reports found
            </div>
          )}
        </div>

        {/* Report Detail */}
        {selectedReport && (
          <div className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Report Details</h3>
              <button onClick={() => setSelectedReport(null)}>
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-sage-500">Report ID</p>
                <p className="font-mono text-sm">{selectedReport.reportId || selectedReport.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-sage-500">Date Reported</p>
                <p>{new Date(selectedReport.createdAt).toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-sage-500">Location</p>
                <p>{selectedReport.location || 'Not specified'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-sage-500">Species Affected</p>
                <p className="capitalize">{selectedReport.species}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-sage-500">Number Affected</p>
                <p>{selectedReport.animalCount}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-sage-500">Symptoms Observed</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(selectedReport.symptoms || []).map((symptom, idx) => (
                    <span key={idx} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 text-xs rounded-full">
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-sage-500">Description</p>
                <p className="mt-1 text-sage-600 dark:text-sage-400">{selectedReport.description}</p>
              </div>
              
              {/* Photos */}
              {selectedReport.photos && selectedReport.photos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-sage-500 mb-2">Photos</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedReport.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt={`Report ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer"
                        onClick={() => window.open(photo, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-sage-500 mb-1">Admin Notes</label>
                <textarea
                  id="adminNotes"
                  rows="3"
                  className="input-field"
                  placeholder="Add verification notes..."
                />
              </div>
              
              {/* Action Buttons */}
              {selectedReport.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      const notes = document.getElementById('adminNotes').value;
                      handleUpdateStatus(selectedReport.id, 'verified', notes);
                    }}
                    className="btn-primary flex-1"
                  >
                    <span className="material-icons-outlined">verified</span>
                    Verify Report
                  </button>
                  <button
                    onClick={() => {
                      const notes = document.getElementById('adminNotes').value;
                      handleUpdateStatus(selectedReport.id, 'rejected', notes);
                    }}
                    className="btn-secondary flex-1"
                  >
                    <span className="material-icons-outlined">close</span>
                    Reject
                  </button>
                </div>
              )}
              
              {selectedReport.status === 'verified' && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                    <span className="material-icons-outlined">check_circle</span>
                    This report has been verified and forwarded to DVS
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseReportsManagement;
