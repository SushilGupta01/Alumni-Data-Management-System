import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  User,
  Award,
  Briefcase,
  DollarSign,
  GraduationCap,
  FileText,
  Users,
  BookOpen,
  Building2,
} from 'lucide-react';

const API_URL = '/api';

const palette = {
  primary: 'from-indigo-900 via-indigo-800 to-slate-900',
  primarySolid: 'bg-indigo-800',
  accent: 'bg-amber-500',
  accentText: 'text-amber-400',
  softBg: 'bg-slate-50',
  cardBg: 'bg-white',
};

const RegisterForm = ({ onSuccess, setCurrentUser, setActiveTab }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    batch: '',
    password: '',
    role: 'alumni',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.data);
        setActiveTab('dashboard');
        onSuccess();
        alert('Registration successful!');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Registration error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Role
        </label>
        <select
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-slate-50"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="alumni">Alumni</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Name
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Email
        </label>
        <input
          type="email"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
          placeholder="your.email@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      {form.role === 'alumni' && (
        <>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
              placeholder="Your phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Batch
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
              placeholder="e.g., 2020"
              value={form.batch}
              onChange={(e) => setForm({ ...form, batch: e.target.value })}
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Password
        </label>
        <input
          type="password"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 py-3 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-300 transition duration-200 shadow-lg hover:shadow-xl"
      >
        Create Account
      </button>
    </form>
  );
};

export default function AlumniManagementSystem() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alumni, setAlumni] = useState([]);
  const [donations, setDonations] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser]);

  const fetchAllData = async () => {
    try {
      const endpoints = [
        'alumni',
        'donations',
        'achievements',
        'projects',
        'jobs',
        'degrees',
      ];
      const promises = endpoints.map((endpoint) =>
        fetch(`${API_URL}/${endpoint}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        }).then((res) =>
          res.ok ? res.json().then((data) => data.data || []) : []
        )
      );
      const [
        alumniData,
        donationsData,
        achievementsData,
        projectsData,
        jobsData,
        degreesData,
      ] = await Promise.all(promises);

      setAlumni(Array.isArray(alumniData) ? alumniData : []);
      setDonations(Array.isArray(donationsData) ? donationsData : []);
      setAchievements(Array.isArray(achievementsData) ? achievementsData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setDegrees(Array.isArray(degreesData) ? degreesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAlumni([]);
      setDonations([]);
      setAchievements([]);
      setProjects([]);
      setJobs([]);
      setDegrees([]);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.data);
        setActiveTab('dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginForm({ email: '', password: '' });
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData(currentUser.role !== 'admin' ? { alumni_id: currentUser.id } : {});
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async () => {
    const endpoint =
      modalType.toLowerCase() === 'alumni' ? 'alumni' : modalType.toLowerCase() + 's';
    const method = editingItem ? 'PUT' : 'POST';
    const url = editingItem
      ? `${API_URL}/${endpoint}/${editingItem.id}`
      : `${API_URL}/${endpoint}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchAllData();
        closeModal();
        alert(`${modalType} ${editingItem ? 'updated' : 'created'} successfully!`);
      } else {
        const error = await res.json();
        alert(error.message || 'Operation failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`${API_URL}/${type}s/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${currentUser.token}` },
      });

      if (res.ok) {
        await fetchAllData();
        alert('Deleted successfully!');
      } else {
        alert('Delete failed');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const canEdit = (item) => {
    if (currentUser.role === 'admin') return true;
    return item.alumni_id === currentUser.id;
  };

  const getData = (tab) => {
    switch (tab) {
      case 'donations':
        return donations;
      case 'achievements':
        return achievements;
      case 'projects':
        return projects;
      case 'jobs':
        return jobs;
      case 'degrees':
        return degrees;
      default:
        return [];
    }
  };

  const renderCardsForTab = (tab) => {
    const items = getData(tab);
    const iconMap = {
      donations: DollarSign,
      achievements: Award,
      projects: FileText,
      jobs: Briefcase,
      degrees: GraduationCap,
    };
    const Icon = iconMap[tab];

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900 capitalize">
            {tab}
          </h2>
          <button
            onClick={() => openModal(tab.slice(0, -1))}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl hover:from-indigo-500 hover:to-indigo-400 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add {tab.slice(0, -1)}</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-sm">
            No {tab} added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {item.title ||
                        item.degree_name ||
                        item.company_name ||
                        item.position ||
                        item.purpose ||
                        (item.description &&
                          item.description.substring(0, 40) + '...') ||
                        'Untitled'}
                    </h3>
                  </div>
                  {canEdit(item) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(tab.slice(0, -1), item)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tab.slice(0, -1), item.id)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  {Object.entries(item)
                    .filter(([key]) => !['id', 'alumni_id', 'password'].includes(key))
                    .slice(0, 5)
                    .map(([key, value]) => (
                      value && (
                        <p key={key} className="truncate">
                          <span className="font-medium capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>{' '}
                          {String(value).substring(0, 60)}
                        </p>
                      )
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${palette.primary} flex items-center justify-center px-4 py-8`}
      >
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Left: visual */}
          <div className="relative hidden lg:flex flex-col justify-between p-10 text-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-4">
                <GraduationCap className="w-4 h-4 mr-1" />
                NIT Sikkim Alumni Network
              </div>
              <h1 className="text-3xl font-bold leading-tight mb-4">
                Stay connected with your <span className="text-amber-400">Alma Mater</span>
              </h1>
              <p className="text-sm text-slate-300 max-w-md">
                A central place for alumni to connect, share achievements, support
                initiatives, and stay updated with institute happenings.
              </p>
            </div>

            <div className="space-y-4 mt-10">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">
                  <Users className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    Strong Alumni Community
                  </p>
                  <p className="text-xs text-slate-400">
                    Engage with peers across batches, industries, and geographies.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    Support & Contributions
                  </p>
                  <p className="text-xs text-slate-400">
                    Track contributions, scholarships, and institutional support.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 pt-6 border-t border-slate-800">
              Built as a Database Management System project for NIT Sikkim.
            </div>
          </div>

          {/* Right: auth card */}
          <div className="bg-slate-50/95 text-slate-900 p-8 lg:p-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-indigo-100">
                  <GraduationCap className="w-6 h-6 text-indigo-800" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Alumni Management System
                  </h2>
                  <p className="text-xs text-slate-500">
                    Secure portal for Alumni & Admin
                  </p>
                </div>
              </div>
            </div>

            {!showRegister ? (
              <>
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Welcome back
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                      placeholder="your.email@example.com"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                    />
                  </div>

                  <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-indigo-700 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-indigo-400 transition duration-200 shadow-lg hover:shadow-xl"
                  >
                    Sign In
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-600">
                    Do not have an account?{' '}
                    <button
                      onClick={() => setShowRegister(true)}
                      className="text-indigo-700 font-semibold hover:text-indigo-900"
                    >
                      Sign up
                    </button>
                  </p>
                </div>

                <div className="mt-6 p-4 bg-slate-100 rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-1">
                    Demo Credentials
                  </p>
                  <p className="text-xs text-slate-600">
                    Admin: admin@alumni.com / admin123
                  </p>
                  <p className="text-xs text-slate-600">
                    Alumni: john@example.com / john123
                  </p>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Create an account
                </h3>
                <RegisterForm
                  onSuccess={() => setShowRegister(false)}
                  setCurrentUser={setCurrentUser}
                  setActiveTab={setActiveTab}
                />
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-600">
                    Already registered?{' '}
                    <button
                      onClick={() => setShowRegister(false)}
                      className="text-indigo-700 font-semibold hover:text-indigo-900"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const filteredAlumni = alumni.filter(
    (a) =>
      a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { name: 'Total Alumni', value: alumni.length, icon: Users, color: 'bg-indigo-600' },
    { name: 'Donations', value: donations.length, icon: DollarSign, color: 'bg-emerald-500' },
    { name: 'Achievements', value: achievements.length, icon: Award, color: 'bg-amber-500' },
    { name: 'Projects', value: projects.length, icon: FileText, color: 'bg-purple-500' },
  ];

  const navTabs = [
    { id: 'dashboard', label: 'Overview', icon: Building2 },
    { id: 'alumni', label: 'Alumni', icon: Users },
    { id: 'donations', label: 'Donations', icon: DollarSign },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'degrees', label: 'Degrees', icon: BookOpen },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${palette.primary} text-slate-900`}>
      {/* Top bar */}
      <header className="bg-slate-950/40 backdrop-blur border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-900/40">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-50">
                Alumni Management System
              </h1>
              <p className="text-xs text-slate-400">
                {currentUser.role === 'admin' ? 'Administrator Panel' : 'Alumni Portal'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-900/60 border border-slate-700 rounded-2xl">
              <User className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-medium text-slate-100">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-800">
                {currentUser.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/50 text-rose-100 rounded-2xl hover:bg-rose-500/20 text-xs"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-slate-950/40 border border-slate-800 rounded-3xl p-3 space-y-3 backdrop-blur">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-2xl text-sm font-medium transition ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                    : 'text-slate-200 hover:bg-slate-900/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content */}
        <main className="flex-1">
          <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur shadow-xl space-y-6">
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm"
                    >
                      <div>
                        <p className="text-xs text-slate-400 mb-1">{stat.name}</p>
                        <p className="text-2xl font-semibold text-slate-50">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.color} p-2.5 rounded-xl shadow-inner`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-sm font-semibold text-slate-100">
                        Recent Alumni
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {alumni.slice(0, 5).map((alum) => (
                        <div
                          key={alum.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-400 flex items-center justify-center text-xs font-semibold text-slate-950">
                              {alum.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-50">
                                {alum.name}
                              </p>
                              <p className="text-xs text-slate-400">{alum.email}</p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-400">
                            {alum.batch || 'Batch N/A'}
                          </span>
                        </div>
                      ))}
                      {alumni.length === 0 && (
                        <p className="text-xs text-slate-400">
                          No alumni records found yet.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                    <h2 className="text-sm font-semibold text-slate-100 mb-3">
                      Quick Overview
                    </h2>
                    <p className="text-xs text-slate-300 mb-4">
                      Use the left navigation to manage alumni, donations, degrees,
                      achievements, projects, and jobs. Admins can manage all entries
                      while alumni can manage only their own profile and records.
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Secure login system with role-based access control.</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>Centralized alumni data for institute use.</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Separate modules for donations, achievements, and more.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'alumni' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search alumni by name or email..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => openModal('alumni')}
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium shadow-md hover:from-indigo-500 hover:to-indigo-400"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Alumni</span>
                    </button>
                  )}
                </div>

                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-800 text-sm">
                    <thead className="bg-slate-950/70">
                      <tr>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Batch
                        </th>
                        <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredAlumni.map((alum) => (
                        <React.Fragment key={alum.id}>
                          <tr className="hover:bg-slate-950/60">
                            <td className="px-5 py-3 whitespace-nowrap text-slate-50">
                              {alum.name}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap text-slate-300">
                              {alum.email}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap text-slate-300">
                              {alum.phone}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap text-slate-300">
                              {alum.batch}
                            </td>
                            <td className="px-5 py-3 whitespace-nowrap">
                              {canEdit(alum) && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openModal('alumni', alum)}
                                    className="text-indigo-400 hover:text-indigo-200"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  {currentUser.role === 'admin' && (
                                    <button
                                      onClick={() => handleDelete('alumni', alum.id)}
                                      className="text-rose-400 hover:text-rose-200"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                          {alum.degrees && alum.degrees.length > 0 && (
                            <tr className="bg-slate-950/80">
                              <td colSpan="5" className="px-5 py-3">
                                <div className="text-xs text-slate-300">
                                  <strong className="text-slate-100">
                                    Degrees:
                                  </strong>
                                  <div className="mt-2 space-y-1">
                                    {alum.degrees.map((degree) => (
                                      <div
                                        key={degree.id}
                                        className="flex justify-between items-center bg-slate-900/80 p-2 rounded-xl border border-slate-800"
                                      >
                                        <div>
                                          <span className="font-medium text-slate-100">
                                            {degree.degree_name}
                                          </span>
                                          {degree.specialization && (
                                            <span className="text-slate-400">
                                              {' '}
                                              - {degree.specialization}
                                            </span>
                                          )}
                                          <br />
                                          <span className="text-[11px] text-slate-500">
                                            {degree.institution},{' '}
                                            {degree.year_of_completion}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                      {filteredAlumni.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-5 py-6 text-center text-xs text-slate-500"
                          >
                            No alumni found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {['donations', 'achievements', 'projects', 'jobs', 'degrees'].includes(
              activeTab
            ) && renderCardsForTab(activeTab)}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-50 mb-4">
              {editingItem ? 'Edit' : 'Add'} {modalType}
            </h2>

            <div className="space-y-4 text-sm">
              {modalType === 'alumni' && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.email || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.phone || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Batch (e.g., 2020)"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.batch || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, batch: e.target.value })
                    }
                  />
                  {!editingItem && (
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                      value={formData.password || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  )}
                </>
              )}

              {modalType === 'donation' && (
                <>
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.amount || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.donation_date || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        donation_date: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Purpose"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.purpose || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                  />
                </>
              )}

              {modalType === 'achievement' && (
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.title || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Description"
                    rows="3"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.achievement_date || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        achievement_date: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {modalType === 'project' && (
                <>
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.title || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Description"
                    rows="3"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Project URL"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.project_url || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        project_url: e.target.value,
                      })
                    }
                  />
                </>
              )}

              {modalType === 'job' && (
                <>
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.company_name || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company_name: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.position || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    placeholder="Start Date"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.start_date || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        start_date: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.location || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </>
              )}

              {modalType === 'degree' && (
                <>
                  <input
                    type="text"
                    placeholder="Degree Name (e.g., B.Tech CSE)"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.degree_name || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        degree_name: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.institution || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        institution: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Year of Completion"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.year_of_completion || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year_of_completion: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Specialization"
                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-950 text-slate-100"
                    value={formData.specialization || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                  />
                </>
              )}

              <div className="flex space-x-3 pt-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-slate-700 rounded-xl text-slate-200 hover:bg-slate-800 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 text-sm font-medium"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
