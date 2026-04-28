import React, { useState, useEffect } from 'react';
import {
  Search, User, PawPrint, Calendar, MapPin, Phone, MessageSquare,
  Activity, AlertTriangle, CheckCircle2, Clock, Filter, Plus,BookOpen, FileText, Bell, X, Settings,
  Stethoscope, Syringe, Heart, TrendingUp, BarChart3, Users,Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Mock patient data
  const mockPatients = [
    {
      id: 1,
      name: 'Bessie',
      tagId: 'BW-2024-0034',
      species: 'Cattle',
      breed: 'Holstein',
      age: '4.2 years',
      owner: 'John Farmer',
      location: 'Farm A, Gaborone',
      status: 'active',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-15',
      conditions: ['Pregnancy', 'Mastitis'],
      vaccinations: ['Anthrax', 'FMD'],
      avatar: '🐄'
    },
    {
      id: 2,
      name: 'Max',
      tagId: 'BW-2024-0056',
      species: 'Sheep',
      breed: 'Merino',
      age: '2.8 years',
      owner: 'Mary Shepherd',
      location: 'Farm B, Francistown',
      status: 'critical',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-25',
      conditions: ['Foot Rot', 'Parasites'],
      vaccinations: ['Clostridial'],
      avatar: '🐑'
    },
    {
      id: 3,
      name: 'Bella',
      tagId: 'BW-2024-0078',
      species: 'Goat',
      breed: 'Boer',
      age: '1.5 years',
      owner: 'Peter Rancher',
      location: 'Farm C, Serowe',
      status: 'stable',
      lastVisit: '2024-01-08',
      nextAppointment: null,
      conditions: ['Healthy'],
      vaccinations: ['PPR', 'Anthrax'],
      avatar: '🐐'
    }
  ];

  useEffect(() => {
    setPatients(mockPatients);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.tagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.owner.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'active': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'stable': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'active': return <Activity className="w-4 h-4" />;
      case 'stable': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar 
        title="My Patients" 
        subtitle="Manage your animal patients" 
        showBack={true}
        backTo="/vet-dashboard"
      />

      <div className="flex flex-1 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-[#f1f5f9] flex flex-col fixed h-full z-10 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.01)] mt-20">
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-[#f1f5f9] flex-shrink-0 gap-3">
          <div className="bg-[#00E5C1] p-1.5 rounded-lg flex items-center justify-center shadow-sm">
             <Shield className="w-5 h-5 text-[#064e3b]" />
          </div>
          <div>
             <span className="font-extrabold text-[#0f172a] text-lg tracking-tight block">Farm-Aid</span>
             <span className="text-[9px] text-gray-400 font-medium">Veterinary Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <Link to="/vet-dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold rounded-xl transition-colors">
            <BarChart3 className="w-5 h-5" /> Dashboard
          </Link>
          <Link to="/patients" className="flex items-center gap-3 px-4 py-3 bg-[#e6fcf9] text-[#0d9488] font-bold rounded-xl transition-colors">
            <Users className="w-5 h-5" /> My Patients
          </Link>
          <Link to="/vet-telehealth" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold rounded-xl transition-colors">
            <MessageSquare className="w-5 h-5" /> Consultations
          </Link>
          <Link to="/knowledge-base" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold rounded-xl transition-colors">
            <BookOpen className="w-5 h-5" /> Knowledge Base
          </Link>
          <Link to="/reports" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold rounded-xl transition-colors">
            <FileText className="w-5 h-5" /> Reports
          </Link>
          <Link to="/notification-center" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-semibold rounded-xl transition-colors">
            <Bell className="w-5 h-5" /> Notifications
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[260px] flex flex-col mt-20">

        {/* Header */}
        <header className="h-20 bg-white border-b border-[#f1f5f9] flex items-center justify-between px-8 shrink-0 z-10">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">My Patients</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your animal patients and their health records</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-[#00E5C1] hover:bg-[#00d4b1] text-[#064e3b] px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition">
              <Plus className="w-4 h-4" /> Add New Patient
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8">

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients by name, tag ID, or owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00E5C1] font-medium"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00E5C1] font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="critical">Critical</option>
                  <option value="active">Active</option>
                  <option value="stable">Stable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Patient Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                      {patient.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500">{patient.tagId}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(patient.status)}`}>
                    {getStatusIcon(patient.status)}
                    {patient.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Species:</span>
                    <span className="font-medium">{patient.species} ({patient.breed})</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Age:</span>
                    <span className="font-medium">{patient.age}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Owner:</span>
                    <span className="font-medium">{patient.owner}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                  </div>
                  <button className="text-[#00E5C1] hover:text-[#00d4b1] font-bold text-sm">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}

        </div>
      </main>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                  {selectedPatient.avatar}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-sm text-gray-500">{selectedPatient.tagId} • {selectedPatient.species}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Patient Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Breed:</span>
                      <span className="font-medium">{selectedPatient.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age:</span>
                      <span className="font-medium">{selectedPatient.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Owner:</span>
                      <span className="font-medium">{selectedPatient.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{selectedPatient.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Health Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedPatient.status)}`}>
                        {selectedPatient.status}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Last Visit:</span>
                      <span className="font-medium ml-2">{new Date(selectedPatient.lastVisit).toLocaleDateString()}</span>
                    </div>
                    {selectedPatient.nextAppointment && (
                      <div className="text-sm">
                        <span className="text-gray-500">Next Appointment:</span>
                        <span className="font-medium ml-2">{new Date(selectedPatient.nextAppointment).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Current Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.conditions.map((condition, index) => (
                    <span key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Vaccination History</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.vaccinations.map((vaccination, index) => (
                    <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {vaccination}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-[#00E5C1] hover:bg-[#00d4b1] text-[#064e3b] py-3 rounded-xl font-bold transition">
                  Start Consultation
                </button>
                <button className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
                  View Full History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};

export default Patients;