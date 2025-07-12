import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import api from '../../services/api';

// Mock data for demonstration
const mockData = {
  totalEventsToday: 1247,
  uniqueUsersToday: 423,
  totalEventsThisWeek: 8934,
  totalEventsThisMonth: 34567,
  topEvents: [
    { name: 'page_view', count: 2847 },
    { name: 'button_click', count: 1523 },
    { name: 'form_submit', count: 987 },
    { name: 'user_signup', count: 567 },
    { name: 'purchase', count: 234 }
  ],
  dailyEvents: [
    { date: '2025-01-05', count: 1200 },
    { date: '2025-01-06', count: 1350 },
    { date: '2025-01-07', count: 1100 },
    { date: '2025-01-08', count: 1400 },
    { date: '2025-01-09', count: 1250 },
    { date: '2025-01-10', count: 1500 },
    { date: '2025-01-11', count: 1247 }
  ],
  monthlyUsers: [
    { month: 'Sep', users: 4200 },
    { month: 'Oct', users: 4800 },
    { month: 'Nov', users: 5200 },
    { month: 'Dec', users: 5900 },
    { month: 'Jan', users: 6400 }
  ]
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics/overview');
        
        // Check if data is empty (all zeros)
        const data = response.data.data;
        const isEmpty = data.totalEventsToday === 0 && 
                       data.uniqueUsersToday === 0 && 
                       data.totalEventsThisWeek === 0 && 
                       data.totalEventsThisMonth === 0;
        
        if (isEmpty) {
          setUseMockData(true);
          setAnalyticsData(mockData);
        } else {
          setAnalyticsData(data);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch analytics data');
        // Use mock data on error
        setUseMockData(true);
        setAnalyticsData(mockData);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const generateSampleData = async () => {
    try {
      setLoading(true);
      //  call  backend to generate sample data
      await api.post('/analytics/generate-sample-data');
      
      // Refresh data
      const response = await api.get('/analytics/overview');
      setAnalyticsData(response.data.data);
      setUseMockData(false);
      
      alert('Sample data generated successfully!');
    } catch (err) {
      console.error('Failed to generate sample data:', err);
      alert('Failed to generate sample data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  if (error && !useMockData) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex items-center space-x-4">
          {useMockData && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                Demo Data
              </span>
              <button
                onClick={generateSampleData}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Generate Real Data
              </button>
            </div>
          )}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'events'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Events
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Users
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider opacity-90">TODAY'S EVENTS</p>
            <p className="mt-2 text-4xl font-bold">{analyticsData.totalEventsToday.toLocaleString()}</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider opacity-90">ACTIVE USERS TODAY</p>
            <p className="mt-2 text-4xl font-bold">{analyticsData.uniqueUsersToday.toLocaleString()}</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider opacity-90">THIS WEEK</p>
            <p className="mt-2 text-4xl font-bold">{analyticsData.totalEventsThisWeek.toLocaleString()}</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider opacity-90">THIS MONTH</p>
            <p className="mt-2 text-4xl font-bold">{analyticsData.totalEventsThisMonth.toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Daily Events">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.dailyEvents}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3b82f6" name="Events" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card title="Top Events">
            <div className="space-y-4">
              {analyticsData.topEvents.map((event, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(event.count / analyticsData.topEvents[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <div className="min-w-[120px] ml-4 text-sm">
                    <span className="font-medium text-gray-900">{event.name}</span>
                    <span className="ml-2 text-gray-500">{event.count.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'events' && (
        <Card title="Event Trends">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.dailyEvents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {activeTab === 'users' && (
        <Card title="User Growth">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.monthlyUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Analytics;