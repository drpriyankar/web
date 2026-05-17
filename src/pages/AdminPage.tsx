import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  LogOut,
  RefreshCw,
  ChevronRight,
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle,
  Star,
  MoreVertical,
  ExternalLink,
  Phone,
  MessageCircle,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface Submission {
  id: string;
  createdAt: string;
  status: 'new' | 'active' | 'completed' | 'cancelled';
  name: string;
  phone: string;
  [key: string]: any;
}

export const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ bookings: Submission[], contacts: Submission[] }>({ bookings: [], contacts: [] });
  const [activeTab, setActiveTab] = useState<'bookings' | 'contacts' | 'calendar'>('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showItemDetails, setShowItemDetails] = useState<Submission | null>(null);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const highlightText = (text: string, highlight: string) => {
    if (!highlight || !highlight.trim()) return text;
    const parts = String(text).split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-primary/20 text-primary font-bold rounded px-0.5">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  useEffect(() => {
    const authStatus = localStorage.getItem('admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const getPriority = (item: Submission) => {
    const urgentKeywords = ['urgent', 'emergency', 'pain', 'dard', 'emergency', 'turant', 'severe', 'acute'];
    const text = (item.symptoms || item.message || '').toLowerCase();
    const isUrgent = urgentKeywords.some(kw => text.includes(kw));
    const isOldNew = item.status === 'new' && (new Date().getTime() - new Date(item.createdAt).getTime() > 24 * 60 * 60 * 1000);
    
    if (isUrgent) return 'urgent';
    if (isOldNew) return 'pending';
    return 'normal';
  };

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab, statusFilter, searchTerm]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const result = await res.json();
      if (result.success) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_auth', 'true');
        fetchData();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  const updateStatus = async (id: string, type: 'booking' | 'contact', status: string) => {
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, status })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const deleteItem = async (id: string, type: 'booking' | 'contact') => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;
    
    try {
      const res = await fetch('/api/admin/delete-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Failed to delete item');
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedIds.length === 0) return;
    const type = activeTab === 'bookings' ? 'booking' : 'contact';
    
    try {
      const res = await fetch('/api/admin/bulk-update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, type, status })
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to perform bulk status update');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) return;
    
    const type = activeTab === 'bookings' ? 'booking' : 'contact';
    
    try {
      const res = await fetch('/api/admin/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, type })
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to perform bulk delete');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(i => i.id));
    }
  };

  const downloadData = (format: 'csv' | 'json') => {
    const items = activeTab === 'bookings' ? data.bookings : data.contacts;
    if (items.length === 0) return;

    let content = '';
    let fileName = `${activeTab}_export_${new Date().toISOString().split('T')[0]}`;
    let mimeType = '';

    if (format === 'csv') {
      const headers = Object.keys(items[0]).join(',');
      const rows = items.map(item => 
        Object.values(item).map(val => {
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        }).join(',')
      );
      content = [headers, ...rows].join('\n');
      fileName += '.csv';
      mimeType = 'text/csv';
    } else {
      content = JSON.stringify(items, null, 2);
      fileName += '.json';
      mimeType = 'application/json';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  };

  const filteredItems = (activeTab === 'calendar' ? data.bookings : (activeTab === 'bookings' ? data.bookings : data.contacts))
    .filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        item.name?.toLowerCase().includes(searchLower) || 
        item.phone?.includes(searchTerm) ||
        (item.symptoms?.toLowerCase().includes(searchLower)) ||
        (item.message?.toLowerCase().includes(searchLower)) ||
        (item.branch?.toLowerCase().includes(searchLower)) ||
        (item.id?.toLowerCase().includes(searchLower));
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      if (sortField === 'createdAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Group bookings for calendar view
  const calendarGroups = data.bookings.reduce((acc, booking) => {
    const date = new Date(booking.createdAt).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(booking);
    return acc;
  }, {} as Record<string, Submission[]>);

  const sortedCalendarDates = Object.keys(calendarGroups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Statistics
  const stats = {
    total: data.bookings.length + data.contacts.length,
    bookings: data.bookings.length,
    contacts: data.contacts.length,
    new: [...data.bookings, ...data.contacts].filter(i => i.status === 'new').length
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-2xl-premium border border-gray-100"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black mb-2">Admin Login</h1>
            <p className="text-text-muted text-sm font-medium">Anandam Arogyam Portal Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Admin ID</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="w-full p-4 bg-bg-base border border-gray-100 rounded-2xl outline-none focus:ring-2 ring-primary/20 font-medium"
                placeholder="Enter ID"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full p-4 bg-bg-base border border-gray-100 rounded-2xl outline-none focus:ring-2 ring-primary/20 font-medium"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Access Portal"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xs">AA</div>
          <span className="font-black text-sm tracking-tight text-text-main">Admin Portal</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-primary bg-primary/5 rounded-lg border border-primary/10"
        >
          {isSidebarOpen ? <XCircle /> : <MoreVertical />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        w-72 bg-white border-r border-gray-100 flex flex-col p-6 fixed h-full z-[55] transition-transform duration-500
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-3 mb-10 px-2 mt-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black">AA</div>
          <span className="font-black text-xl tracking-tight">Admin <span className="text-primary text-xs bg-primary/5 px-2 py-0.5 rounded ml-1">v2.0</span></span>
        </div>

        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => { setActiveTab('bookings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'bookings' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:bg-bg-base'}`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              Appointments
            </div>
            {data.bookings.filter(b => b.status === 'new').length > 0 && (
              <span className={`w-5 h-5 ${activeTab === 'bookings' ? 'bg-white text-primary' : 'bg-primary text-white'} text-[10px] rounded-full flex items-center justify-center`}>
                {data.bookings.filter(b => b.status === 'new').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => { setActiveTab('calendar'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${activeTab === 'calendar' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:bg-bg-base'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Calendar View
          </button>
          <button 
            onClick={() => { setActiveTab('contacts'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'contacts' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:bg-bg-base'}`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" />
              Messages
            </div>
            {data.contacts.filter(c => c.status === 'new').length > 0 && (
                <span className={`w-5 h-5 ${activeTab === 'contacts' ? 'bg-white text-primary' : 'bg-primary text-white'} text-[10px] rounded-full flex items-center justify-center`}>
                    {data.contacts.filter(c => c.status === 'new').length}
                </span>
            )}
          </button>
        </nav>

        <div className="mt-auto space-y-2 border-t border-gray-100 pt-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-text-muted font-bold hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-72 flex-1 p-6 md:p-10">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-10 no-print gap-6">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight flex items-center justify-center sm:justify-start gap-3 text-text-main">
              Dashboard
            </h2>
            <p className="text-text-muted font-medium mt-1">Sahi decisions lo, data analysis ke saath.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <div className="flex items-center bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
               <button onClick={() => downloadData('csv')} className="flex items-center gap-2 px-3 md:px-4 py-2 hover:bg-emerald-50 rounded-xl font-bold text-[10px] md:text-xs transition-all text-emerald-600">
                <FileSpreadsheet className="w-4 h-4" />
                CSV
              </button>
              <button onClick={() => downloadData('json')} className="flex items-center gap-2 px-3 md:px-4 py-2 hover:bg-amber-50 rounded-xl font-bold text-[10px] md:text-xs transition-all text-amber-600">
                <Download className="w-4 h-4" />
                JSON
              </button>
            </div>
            
            <button onClick={fetchData} className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center hover:bg-primary/10 transition-all border border-primary/10">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {[
            { label: 'Total Inquiries', value: stats.total, icon: LayoutDashboard, color: 'text-primary', bg: 'bg-primary' },
            { label: 'Pending New', value: stats.new, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500' },
            { label: 'Appointments', value: stats.bookings, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500' },
            { label: 'Direct Messages', value: stats.contacts, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${stat.bg}/10 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-text-main">{stat.value}</div>
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 md:p-5 rounded-[32px] border border-gray-100 mb-8 flex flex-col sm:flex-row items-center gap-4 no-print shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder={`Search in ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 bg-bg-base border border-gray-100 rounded-2xl outline-none focus:ring-2 ring-primary/20 font-medium text-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-text-muted hidden sm:block" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-bg-base border border-gray-100 rounded-2xl px-4 py-3.5 font-bold text-xs text-text-main outline-none focus:ring-2 ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Dynamic Content */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-text-main text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8 z-50 border border-white/10"
            >
              <div className="flex items-center gap-2 pr-8 border-r border-white/10">
                <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-black">{selectedIds.length}</span>
                <span className="text-sm font-bold">Items Selected</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleBulkStatusUpdate('active')}
                  className="px-4 py-2 hover:bg-white/10 rounded-xl text-xs font-black transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  MARK ACTIVE
                </button>
                <button 
                  onClick={() => handleBulkStatusUpdate('completed')}
                  className="px-4 py-2 hover:bg-white/10 rounded-xl text-xs font-black transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  COMPLETE
                </button>
                <button 
                  onClick={() => handleBulkStatusUpdate('cancelled')}
                  className="px-4 py-2 hover:bg-white/10 rounded-xl text-xs font-black transition-all flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  CANCEL
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-xs font-black transition-all flex items-center gap-2 ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                  DELETE
                </button>
              </div>

              <button 
                onClick={() => setSelectedIds([])}
                className="ml-8 p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'calendar' ? (
          <div className="space-y-8">
            {sortedCalendarDates.map(date => (
              <div key={date}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[1px] flex-1 bg-gray-100"></div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{date}</span>
                  <div className="h-[1px] flex-1 bg-gray-100"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {calendarGroups[date].map(booking => (
                    <motion.div 
                      key={booking.id}
                      layoutId={booking.id}
                      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      <div className={`absolute top-0 right-0 w-12 h-12 flex items-center justify-center -mr-3 -mt-3 rotate-12 ${
                        booking.status === 'new' ? 'bg-blue-500' :
                        booking.status === 'active' ? 'bg-orange-500' :
                        booking.status === 'completed' ? 'bg-emerald-500' :
                        'bg-gray-400'
                      } text-white opacity-10`}>
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                          booking.status === 'new' ? 'bg-blue-50 text-blue-600' :
                          booking.status === 'active' ? 'bg-orange-50 text-orange-600' :
                          booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-gray-50 text-gray-400'
                        }`}>
                          {booking.status}
                        </span>
                        <span className="text-xs font-black text-primary">{booking.timing}</span>
                      </div>
                      <h4 className="font-black text-lg text-text-main mb-1">{booking.name}</h4>
                      <p className="text-sm font-bold text-text-muted mb-4">{booking.phone}</p>
                      
                      <div className="space-y-3 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded font-bold uppercase">{booking.branch}</span>
                          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">{booking.bookingType}</span>
                        </div>
                        <p className="text-xs text-text-muted italic line-clamp-2">"{booking.symptoms}"</p>
                      </div>
                      
                      <div className="mt-6 flex items-center gap-2">
                        <button 
                          onClick={() => updateStatus(booking.id, 'booking', 'active')}
                          className="flex-1 py-2 bg-bg-base hover:bg-primary hover:text-white rounded-xl text-[10px] font-black transition-all"
                        >
                          MANAGE
                        </button>
                        <button 
                          onClick={() => deleteItem(booking.id, 'booking')}
                          className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm print:shadow-none">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-bg-base/20">
            <h3 className="font-black text-lg uppercase tracking-tight flex items-center gap-2">
              {activeTab === 'bookings' ? 'Appointments' : 'Messages'} Log
              <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">{filteredItems.length}</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-bg-base/30">
                  <th className="p-6 w-16 no-print">
                    <button 
                      onClick={toggleSelectAll}
                      className="w-6 h-6 flex items-center justify-center text-primary"
                    >
                      {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? (
                        <CheckSquare className="w-6 h-6" />
                      ) : (
                        <Square className="w-6 h-6" />
                      )}
                    </button>
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                    <button 
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Date & ID
                      {sortField === 'createdAt' ? (
                        sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      ) : <ArrowUpDown className="w-3 h-3" />}
                    </button>
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Patient
                      {sortField === 'name' ? (
                        sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      ) : <ArrowUpDown className="w-3 h-3" />}
                    </button>
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">Concern / Details</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                    <button 
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      State
                      {sortField === 'status' ? (
                        sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      ) : <ArrowUpDown className="w-3 h-3" />}
                    </button>
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 no-print">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => {
                  const priority = getPriority(item);
                  return (
                  <tr key={item.id} className={`hover:bg-bg-base/20 transition-colors group ${selectedIds.includes(item.id) ? 'bg-primary/5' : ''}`}>
                    <td className="p-6 no-print">
                      <button 
                        onClick={() => toggleSelect(item.id)}
                        className={`w-6 h-6 flex items-center justify-center transition-colors ${selectedIds.includes(item.id) ? 'text-primary' : 'text-gray-300'}`}
                      >
                        {selectedIds.includes(item.id) ? (
                          <CheckSquare className="w-6 h-6" />
                        ) : (
                          <Square className="w-6 h-6" />
                        )}
                      </button>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="block font-bold text-primary text-sm">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-[10px] font-mono text-gray-400 block truncate w-24">#{item.id.split('_')[1]}</span>
                        {priority === 'urgent' && (
                          <span className="flex items-center gap-1 text-[8px] font-black text-rose-500 uppercase mt-1 animate-pulse">
                            <AlertTriangle className="w-2.5 h-2.5" /> High Priority
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-black text-text-main group-hover:text-primary transition-colors flex items-center gap-2">
                          {highlightText(item.name, searchTerm)}
                          {item.status === 'new' && (
                            <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                          )}
                        </span>
                        <a href={`tel:${item.phone}`} className="text-xs text-text-muted font-bold hover:underline">{highlightText(item.phone, searchTerm)}</a>
                      </div>
                    </td>
                    <td className="p-6">
                      {activeTab === 'bookings' ? (
                        <div className="space-y-1">
                          <div className="flex gap-1.5 flex-wrap">
                            <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-0.5 rounded-md font-black uppercase">
                                {highlightText(item.bookingType, searchTerm)}
                            </span>
                            <span className="bg-primary/5 text-primary text-[9px] px-2 py-0.5 rounded-md font-black uppercase">
                                {highlightText(item.branch, searchTerm)}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-text-muted leading-relaxed line-clamp-1 group-hover:line-clamp-none transition-all cursor-pointer" onClick={() => setShowItemDetails(item)}>
                            <span className="text-gray-400">Symptoms:</span> {highlightText(item.symptoms, searchTerm)}
                          </div>
                          <div className="text-xs font-medium text-gray-400">
                            <Clock className="w-3 h-3 inline mr-1" /> {item.timing}
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-xs text-xs font-medium text-text-muted italic leading-relaxed bg-gray-50 p-3 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors cursor-pointer line-clamp-2" onClick={() => setShowItemDetails(item)}>
                          "{highlightText(item.message, searchTerm)}"
                        </div>
                      )}
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'new' ? 'bg-blue-100 text-blue-600 border border-blue-200' :
                        item.status === 'active' ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                        item.status === 'completed' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' :
                        'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}>
                        {item.status === 'new' && <Clock className="w-3.5 h-3.5" />}
                        {item.status === 'active' && <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />}
                        {item.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {item.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="p-6 no-print">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setShowItemDetails(item)}
                          className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm group/btn"
                          title="View Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        {item.status !== 'active' && item.status !== 'completed' && (
                          <button 
                            onClick={() => updateStatus(item.id, activeTab === 'bookings' ? 'booking' : 'contact', 'active')}
                            className="w-10 h-10 flex items-center justify-center bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm group/btn"
                            title="Start Managing"
                          >
                            <RefreshCw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </main>

      {/* Details Side Panel */}
      <AnimatePresence>
        {showItemDetails && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowItemDetails(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full sm:max-w-xl bg-white shadow-2xl z-[70] p-6 sm:p-10 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <h3 className="text-xl sm:text-3xl font-black">{activeTab === 'bookings' ? 'Booking' : 'Message'} Details</h3>
                <button onClick={() => setShowItemDetails(null)} className="p-2 hover:bg-bg-base rounded-full">
                  <XCircle className="w-6 h-6 text-gray-400 hover:text-primary transition-colors" />
                </button>
              </div>

              <div className="space-y-8 sm:space-y-10">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-8 sm:pb-10 border-b border-gray-100 text-center sm:text-left">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-2xl sm:text-3xl">
                    {activeTab === 'bookings' ? '📅' : '✉️'}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">{showItemDetails.status}</div>
                    <h4 className="text-2xl sm:text-3xl font-black text-text-main leading-tight">{showItemDetails.name}</h4>
                    <p className="text-text-muted font-bold">{showItemDetails.phone}</p>
                  </div>
                </div>

                {/* Main Content */}
                <div className="grid gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Submission Date</label>
                    <div className="p-4 bg-bg-base rounded-2xl font-bold flex items-center gap-4">
                      <Clock className="w-5 h-5 text-gray-400" />
                      {new Date(showItemDetails.createdAt).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}
                    </div>
                  </div>

                  {activeTab === 'bookings' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Branch</label>
                        <div className="p-4 bg-primary/5 rounded-2xl font-black text-xs text-primary border border-primary/10 shadow-sm">{showItemDetails.branch}</div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Type</label>
                        <div className="p-4 bg-blue-50 rounded-2xl font-black text-xs text-blue-600 border border-blue-100 shadow-sm">{showItemDetails.bookingType}</div>
                      </div>
                      <div className="space-y-3 col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Appointment Slot</label>
                        <div className="p-4 bg-bg-base rounded-2xl font-black text-primary border border-gray-100">{showItemDetails.timing}</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'contacts' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Issue Area</label>
                      <div className="p-4 bg-bg-base rounded-2xl font-bold border border-gray-100">{showItemDetails.issue}</div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                       {activeTab === 'bookings' ? 'Patient Concern (Symptoms)' : 'Message Content'}
                    </label>
                    <div className="p-8 bg-bg-base rounded-[32px] font-medium text-text-main leading-relaxed border border-gray-100 text-lg shadow-inner min-h-[150px]">
                      {activeTab === 'bookings' ? showItemDetails.symptoms : showItemDetails.message}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-8 sm:pt-10 border-t border-gray-100 space-y-6">
                   <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Quick Actions</div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={() => {
                          window.open(`tel:${showItemDetails.phone}`);
                        }}
                        className="flex items-center justify-center gap-3 p-5 bg-primary text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                      >
                         <Phone className="w-5 h-5" /> Phone Call
                      </button>
                      <button 
                        onClick={() => {
                          const msg = `Namaste ${showItemDetails.name}, Dr. Priyankar ki team se Anandam Arogyam se sampark kar rahe hain.`;
                          window.open(`https://wa.me/${showItemDetails.phone.replace(/\+/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        className="flex items-center justify-center gap-3 p-5 bg-whatsapp text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-whatsapp/20 hover:scale-[1.02] transition-all"
                      >
                         <MessageCircle className="w-5 h-5" /> WhatsApp
                      </button>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button 
                        onClick={() => { updateStatus(showItemDetails.id, activeTab === 'bookings' ? 'booking' : 'contact', 'completed'); setShowItemDetails(null); }}
                        className="flex items-center justify-center gap-2 p-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-emerald-100"
                      >
                         Complete
                      </button>
                      <button 
                        onClick={() => { updateStatus(showItemDetails.id, activeTab === 'bookings' ? 'booking' : 'contact', 'cancelled'); setShowItemDetails(null); }}
                        className="flex items-center justify-center gap-2 p-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-100"
                      >
                         Cancel
                      </button>
                      <button 
                        onClick={() => { deleteItem(showItemDetails.id, activeTab === 'bookings' ? 'booking' : 'contact'); setShowItemDetails(null); }}
                        className="flex items-center justify-center gap-2 p-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-100"
                      >
                         Delete
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          aside { display: none !important; }
          main { margin-left: 0 !important; width: 100% !important; padding: 0 !important; }
          .bg-bg-base { background: white !important; }
          table { width: 100% !important; font-size: 10px !important; }
          .rounded-[40px] { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
};

