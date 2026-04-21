import React, { useState, useEffect } from 'react';
import { Users, Check, X, Trash2, Plus, Edit, EyeOff, AlertCircle, BookOpen, Bell, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/userApi';

// Knowledge Base Component
const KnowledgeBaseComponent = () => {
  const [articles, setArticles] = useState([
    { id: 1, title: 'Livestock Vaccination Guide', category: 'Health', date: '2024-04-10', status: 'published' },
    { id: 2, title: 'Sustainable Farming Practices', category: 'Agriculture', date: '2024-04-08', status: 'published' }
  ]);
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleAddArticle = () => {
    if (!formData.title || !formData.category || !formData.content) {
      alert('Please fill all fields'); return;
    }
    setLoading(true);
    setTimeout(() => {
      setArticles([...articles, { id: articles.length + 1, title: formData.title, category: formData.category, date: new Date().toISOString().split('T')[0], status: 'published' }]);
      setFormData({ title: '', category: '', content: '' });
      setShowAddArticle(false);
      setSuccessMessage('Article added successfully!');
      setLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Knowledge Base</h2>
        <button onClick={() => setShowAddArticle(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#ea580c] text-white rounded-lg hover:bg-[#c2410a]">
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>
      {successMessage && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold">✓ {successMessage}</div>}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left font-semibold">Title</th><th className="px-6 py-3 text-left font-semibold">Category</th><th className="px-6 py-3 text-left font-semibold">Date</th><th className="px-6 py-3 text-left font-semibold">Status</th><th className="px-6 py-3 text-left font-semibold">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">{articles.map(article => (<tr key={article.id} className="hover:bg-gray-50"><td className="px-6 py-3">{article.title}</td><td className="px-6 py-3 text-gray-600">{article.category}</td><td className="px-6 py-3 text-gray-600">{article.date}</td><td className="px-6 py-3"><span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Published</span></td><td className="px-6 py-3 flex gap-2"><button className="p-2 hover:bg-gray-200 rounded"><Edit className="w-4 h-4 text-blue-600" /></button><button className="p-2 hover:bg-gray-200 rounded"><Trash2 className="w-4 h-4 text-red-600" /></button></td></tr>))}</tbody>
        </table>
      </div>
      {showAddArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center"><h3 className="text-lg font-bold">Add Article</h3><button onClick={() => setShowAddArticle(false)} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea580c]/30" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label><select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm cursor-pointer"><option value="">Select category</option><option value="Health">Health & Diseases</option><option value="Agriculture">Agriculture</option><option value="Nutrition">Nutrition & Feeding</option><option value="Breeding">Breeding & Genetics</option></select></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label><textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows="6" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ea580c]/30" /></div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex gap-3 justify-end"><button onClick={() => setShowAddArticle(false)} className="px-4 py-2.5 border border-gray-200 rounded-lg font-semibold">Cancel</button><button onClick={handleAddArticle} disabled={loading} className="px-4 py-2.5 bg-[#ea580c] text-white rounded-lg font-semibold">{loading ? 'Saving...' : 'Add Article'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Announcements Component  
const AnnouncementsComponent = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'System Maintenance Alert', message: 'System will be down for maintenance on Friday', date: '2024-04-15', priority: 'high' },
    { id: 2, title: 'New Feature Released', message: 'Livestock tracking feature is now available', date: '2024-04-10', priority: 'normal' }
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', priority: 'normal' });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleAddAnnouncement = () => {
    if (!formData.title || !formData.message) { alert('Please fill all fields'); return; }
    setLoading(true);
    setTimeout(() => {
      setAnnouncements([...announcements, { id: announcements.length + 1, title: formData.title, message: formData.message, date: new Date().toISOString().split('T')[0], priority: formData.priority }]);
      setFormData({ title: '', message: '', priority: 'normal' });
      setShowAdd(false);
      setSuccessMessage('Announcement broadcast successfully!');
      setLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 500);
  };

  const getPriorityColor = (priority) => priority === 'high' ? 'bg-red-100 text-red-700' : priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Announcements & Alerts</h2>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#ea580c] text-white rounded-lg hover:bg-[#c2410a]">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>
      {successMessage && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold">✓ {successMessage}</div>}
      <div className="space-y-3">
        {announcements.map(announcement => (
          <div key={announcement.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2"><h3 className="font-bold text-gray-800">{announcement.title}</h3><span className={`px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(announcement.priority)}`}>{announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}</span></div>
                <p className="text-gray-600 text-sm">{announcement.message}</p><p className="text-gray-400 text-xs mt-2">{announcement.date}</p>
              </div>
              <div className="flex gap-2"><button className="p-2 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-blue-600" /></button><button className="p-2 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-600" /></button></div>
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between"><h3 className="text-lg font-bold">Broadcast Announcement</h3><button onClick={() => setShowAdd(false)} className="p-1"><X className="w-5 h-5" /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label><select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm cursor-pointer"><option value="low">Low</option><option value="normal">Normal</option><option value="medium">Medium</option><option value="high">High</option></select></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label><textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows="5" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm" /></div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex gap-3 justify-end"><button onClick={() => setShowAdd(false)} className="px-4 py-2.5 border border-gray-200 rounded-lg">Cancel</button><button onClick={handleAddAnnouncement} disabled={loading} className="px-4 py-2.5 bg-[#ea580c] text-white rounded-lg">{loading ? 'Broadcasting...' : 'Broadcast'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

// User Management Component
const UserManagementComponent = () => {
  const [activeTab, setActiveTab] = useState('farmers');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', status: 'active' });

  // Fetch farmers on mount
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setFetching(true);
        const data = await userApi.getFarmers();
        setFarmers(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error('Error fetching farmers:', err);
        setError('Failed to load farmers. Please try again.');
      } finally {
        setFetching(false);
      }
    };
    fetchFarmers();
  }, []);

  // Fetch veterinarians on mount
  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        setFetching(true);
        const data = await userApi.getVeterinarians();
        setVeterinarians(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error('Error fetching veterinarians:', err);
        setError('Failed to load veterinarians. Please try again.');
      } finally {
        setFetching(false);
      }
    };
    fetchVeterinarians();
  }, []);

  useEffect(() => { if (successMessage) { const timer = setTimeout(() => setSuccessMessage(null), 3000); return () => clearTimeout(timer); } }, [successMessage]);

  const resetForm = () => { setFormData({ name: '', email: '', phone: '', status: 'active' }); setSelectedUser(null); setError(null); };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^(\+\d{1,3})?[\s.-]?\d{3,14}$/.test(phone);

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.phone) { setError('Please fill in all required fields'); return; }
    if (!validateEmail(formData.email)) { setError('Please enter a valid email address'); return; }
    if (!validatePhone(formData.phone)) { setError('Please enter a valid phone number'); return; }
    
    setLoading(true);
    try {
      if (activeTab === 'farmers') {
        if (!formData.farmName || !formData.location) { setError('Please fill in farm details'); return; }
        const newFarmer = await userApi.addFarmer({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          farmName: formData.farmName,
          location: formData.location,
          status: formData.status
        });
        setFarmers([...farmers, newFarmer]);
      } else {
        if (!formData.license || !formData.specialization) { setError('Please fill in veterinary details'); return; }
        const newVet = await userApi.addVeterinarian({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          license: formData.license,
          specialization: formData.specialization,
          status: formData.status
        });
        setVeterinarians([...veterinarians, newVet]);
      }
      resetForm();
      setShowAddModal(false);
      setSuccessMessage(`${activeTab === 'farmers' ? 'Farmer' : 'Veterinarian'} added successfully!`);
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      if (activeTab === 'farmers') {
        const updatedFarmer = await userApi.updateFarmer(selectedUser.id, { ...selectedUser, ...formData });
        setFarmers(farmers.map(f => f.id === selectedUser.id ? updatedFarmer : f));
      } else {
        const updatedVet = await userApi.updateVeterinarian(selectedUser.id, { ...selectedUser, ...formData });
        setVeterinarians(veterinarians.map(v => v.id === selectedUser.id ? updatedVet : v));
      }
      resetForm();
      setShowEditModal(false);
      setSuccessMessage(`${activeTab === 'farmers' ? 'Farmer' : 'Veterinarian'} updated successfully!`);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    setLoading(true);
    try {
      if (activeTab === 'farmers') {
        await userApi.deleteFarmer(id);
        setFarmers(farmers.filter(f => f.id !== id));
      } else {
        await userApi.deleteVeterinarian(id);
        setVeterinarians(veterinarians.filter(v => v.id !== id));
      }
      setSuccessMessage('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      ...(activeTab === 'farmers' ? { farmName: user.farmName, location: user.location } : { license: user.license, specialization: user.specialization })
    });
    setShowEditModal(true); setError(null);
  };

  const handleToggleStatus = async (id) => {
    try {
      if (activeTab === 'farmers') {
        const user = farmers.find(f => f.id === id);
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        const updated = await userApi.updateFarmerStatus(id, newStatus);
        setFarmers(farmers.map(f => f.id === id ? { ...f, status: newStatus } : f));
      } else {
        const user = veterinarians.find(v => v.id === id);
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        const updated = await userApi.updateVeterinarianStatus(id, newStatus);
        setVeterinarians(veterinarians.map(v => v.id === id ? { ...v, status: newStatus } : v));
      }
      setSuccessMessage('User status updated!');
    } catch (err) {
      console.error('Error toggling status:', err);
      setError(err.message || 'Failed to update status');
    }
  };

  const currentUsers = activeTab === 'farmers' ? farmers : veterinarians;
  const filteredUsers = currentUsers.filter(u => {
    const search = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const status = filterStatus === 'all' || u.status === filterStatus;
    return search && status;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-800">User Management</h2><button onClick={() => { resetForm(); setShowAddModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-[#ea580c] text-white rounded-lg"><Plus className="w-4 h-4" /> Add {activeTab === 'farmers' ? 'Farmer' : 'Veterinarian'}</button></div>
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</div>}
      {successMessage && <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold">✓ {successMessage}</div>}
      {fetching ? <div className="p-12 text-center text-gray-600">Loading users...</div> : <>
      <div className="flex border-b border-gray-200 gap-6"><button onClick={() => { setActiveTab('farmers'); resetForm(); }} className={`py-3 px-4 font-semibold border-b-2 ${activeTab === 'farmers' ? 'border-[#ea580c] text-[#ea580c]' : 'border-transparent'}`}>Farmers ({farmers.length})</button><button onClick={() => { setActiveTab('veterinarians'); resetForm(); }} className={`py-3 px-4 font-semibold border-b-2 ${activeTab === 'veterinarians' ? 'border-[#ea580c] text-[#ea580c]' : 'border-transparent'}`}>Veterinarians ({veterinarians.length})</button></div>
      <div className="flex gap-3 flex-wrap"><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 min-w-[200px] px-4 py-2.5 border rounded-lg text-sm" /><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 border rounded-lg text-sm"><option value="all">All</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
      <div className="bg-white border border-gray-100 rounded-lg overflow-x-auto">{filteredUsers.length === 0 ? <div className="p-12 text-center text-gray-600">No users found</div> : <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left font-semibold">ID</th><th className="px-6 py-3 text-left font-semibold">Name</th><th className="px-6 py-3 text-left font-semibold">Email</th><th className="px-6 py-3 text-left font-semibold">Phone</th><th className="px-6 py-3 text-left font-semibold">{activeTab === 'farmers' ? 'Farm' : 'License'}</th><th className="px-6 py-3 text-left font-semibold">Status</th><th className="px-6 py-3 text-left font-semibold">Actions</th></tr></thead><tbody className="divide-y">{filteredUsers.map(user => (<tr key={user.id} className="hover:bg-gray-50"><td className="px-6 py-3 font-semibold text-gray-600">{user.id}</td><td className="px-6 py-3 font-semibold">{user.name}</td><td className="px-6 py-3 text-gray-600">{user.email}</td><td className="px-6 py-3 text-gray-600">{user.phone}</td><td className="px-6 py-3 text-gray-600">{activeTab === 'farmers' ? user.farmName : user.license}</td><td className="px-6 py-3"><span onClick={() => handleToggleStatus(user.id)} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{user.status === 'active' ? <Check className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}{user.status === 'active' ? 'Active' : 'Inactive'}</span></td><td className="px-6 py-3 flex gap-2"><button onClick={() => handleEditClick(user)} className="p-2 hover:bg-blue-100 rounded"><Edit className="w-4 h-4 text-blue-600" /></button><button onClick={() => handleDeleteUser(user.id)} className="p-2 hover:bg-red-100 rounded"><Trash2 className="w-4 h-4 text-red-600" /></button></td></tr>))}</tbody></table>}</div>
      </>}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between"><h3 className="text-lg font-bold">{showAddModal ? `Add ${activeTab === 'farmers' ? 'Farmer' : 'Veterinarian'}` : `Edit ${activeTab === 'farmers' ? 'Farmer' : 'Veterinarian'}`}</h3><button onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className="p-1"><X className="w-5 h-5" /></button></div>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</div>}
              <div><label className="block text-sm font-semibold mb-2">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-semibold mb-2">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg text-sm" /></div>
              <div><label className="block text-sm font-semibold mb-2">Phone *</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg text-sm" /></div>
              {activeTab === 'farmers' ? (<><div><label className="block text-sm font-semibold mb-2">Farm Name *</label><input type="text" value={formData.farmName || ''} onChange={(e) => setFormData({ ...formData, farmName: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg text-sm" /></div><div><label className="block text-sm font-semibold mb-2">Location *</label><input type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg text-sm" /></div></>) : (<><div><label className="block text-sm font-semibold mb-2">License Number *</label><input type="text" value={formData.license || ''} onChange={(e) => setFormData({ ...formData, license: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg text-sm" /></div><div><label className="block text-sm font-semibold mb-2">Specialization *</label><select value={formData.specialization || ''} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg text-sm cursor-pointer"><option value="">Select specialization</option><option value="Ruminants">Ruminants</option><option value="Poultry">Poultry</option><option value="Swine">Swine</option><option value="General">General Practice</option></select></div></>)}
              <div><label className="block text-sm font-semibold mb-2">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg text-sm cursor-pointer"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex gap-3 justify-end"><button onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }} className="px-4 py-2.5 border rounded-lg">Cancel</button><button onClick={showAddModal ? handleAddUser : handleEditUser} disabled={loading} className="px-4 py-2.5 bg-[#ea580c] text-white rounded-lg">{loading ? 'Saving...' : showAddModal ? 'Add' : 'Update'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Admin Dashboard
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('users');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { if (window.confirm('Are you sure you want to logout?')) { logout(); navigate('/login'); } };

  const navigationItems = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'announcements', label: 'Announcements', icon: Bell },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-[#0f172a] text-white flex flex-col overflow-hidden`}>
        <div className="p-6 border-b border-gray-700"><h1 className="text-2xl font-bold">Farm AID</h1><p className="text-gray-400 text-xs mt-1">Admin Console</p></div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">{navigationItems.map(item => { const Icon = item.icon; const isActive = activeSection === item.id; return (<button key={item.id} onClick={() => setActiveSection(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition ${isActive ? 'bg-[#ea580c]' : 'text-gray-300 hover:bg-gray-800'}`}><Icon className="w-5 h-5" />{item.label}</button>); })}</nav>
        <div className="p-4 border-t border-gray-700"><button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg"><LogOut className="w-5 h-5" />Logout</button></div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4"><button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-6 h-6" /></button><h2 className="text-2xl font-bold">{navigationItems.find(item => item.id === activeSection)?.label}</h2></div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"><LogOut className="w-4 h-4" />Logout</button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {activeSection === 'users' && <UserManagementComponent />}
            {activeSection === 'knowledge' && <KnowledgeBaseComponent />}
            {activeSection === 'announcements' && <AnnouncementsComponent />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
