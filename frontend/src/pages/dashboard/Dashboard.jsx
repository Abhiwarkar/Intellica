import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [businessMetrics, setBusinessMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchDashboardData();
    fetchBusinessMetrics();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/overview');
      setStats(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessMetrics = async () => {
    try {
      // Mock business metrics - replace with real API
      const mockBusinessData = {
        revenue: {
          total: 45280,
          growth: 23.5,
          recurring: 32450,
          oneTime: 12830
        },
        conversion: {
          rate: 3.4,
          improvement: 0.8,
          totalConversions: 156
        },
        customers: {
          total: 1247,
          new: 89,
          returning: 158,
          churn: 12,
          ltv: 892.50
        },
        alerts: [
          {
            type: 'warning',
            title: 'Cart Abandonment Alert',
            message: 'Cart abandonment increased by 25% today',
            impact: '$3,200 potential revenue loss',
            action: 'Set up recovery email campaign'
          },
          {
            type: 'success', 
            title: 'Conversion Improvement',
            message: 'Landing page conversion rate up 18%',
            impact: '+$1,800 additional revenue',
            action: 'Scale successful campaigns'
          },
          {
            type: 'info',
            title: 'Traffic Spike',
            message: 'Organic traffic increased 45% this week',
            impact: '2,300 new visitors',
            action: 'Monitor server performance'
          }
        ],
        topSources: [
          { name: 'Organic Search', value: 45, revenue: 15680 },
          { name: 'Paid Ads', value: 28, revenue: 12450 },
          { name: 'Direct', value: 15, revenue: 8900 },
          { name: 'Social', value: 8, revenue: 4200 },
          { name: 'Email', value: 4, revenue: 4050 }
        ],
        revenueByDay: [
          { day: 'Mon', revenue: 1420, visitors: 890 },
          { day: 'Tue', revenue: 1680, visitors: 1240 },
          { day: 'Wed', revenue: 1250, visitors: 980 },
          { day: 'Thu', revenue: 1890, visitors: 1450 },
          { day: 'Fri', revenue: 2100, visitors: 1680 },
          { day: 'Sat', revenue: 1650, visitors: 1200 },
          { day: 'Sun', revenue: 1380, visitors: 950 }
        ]
      };
      setBusinessMetrics(mockBusinessData);
    } catch (err) {
      console.error('Failed to fetch business metrics:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '📊';
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            📧 Email Report
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider opacity-90">Monthly Revenue</p>
            <p className="mt-2 text-4xl font-bold">{businessMetrics ? formatCurrency(businessMetrics.revenue.total) : '$0'}</p>
            <p className="text-sm opacity-75">
              {businessMetrics ? formatPercentage(businessMetrics.revenue.growth) : '+0%'} vs last month
            </p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider opacity-90">Conversion Rate</p>
            <p className="mt-2 text-4xl font-bold">{businessMetrics ? businessMetrics.conversion.rate : 0}%</p>
            <p className="text-sm opacity-75">
              {businessMetrics ? formatPercentage(businessMetrics.conversion.improvement) : '+0%'} improvement
            </p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider opacity-90">Total Customers</p>
            <p className="mt-2 text-4xl font-bold">{businessMetrics ? businessMetrics.customers.total.toLocaleString() : '0'}</p>
            <p className="text-sm opacity-75">
              +{businessMetrics ? businessMetrics.customers.new : 0} new this month
            </p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-wider opacity-90">Customer LTV</p>
            <p className="mt-2 text-4xl font-bold">{businessMetrics ? formatCurrency(businessMetrics.customers.ltv) : '$0'}</p>
            <p className="text-sm opacity-75">Average lifetime value</p>
          </div>
        </Card>
      </div>

      {/* Smart Alerts */}
      <Card title="🚨 Smart Business Alerts" className="border-l-4 border-l-red-500">
        <div className="space-y-4">
          {businessMetrics?.alerts.map((alert, index) => (
            <div key={index} className={`p-4 border rounded-lg ${getAlertBgColor(alert.type)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold flex items-center">
                    <span className="mr-2">{getAlertIcon(alert.type)}</span>
                    {alert.title}
                  </h4>
                  <p className="text-sm mt-1">{alert.message}</p>
                  <p className="text-xs font-medium mt-2">{alert.impact}</p>
                </div>
                <button className="ml-4 px-3 py-1 bg-white bg-opacity-80 rounded text-xs font-medium hover:bg-opacity-100">
                  {alert.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card title="Daily Revenue & Traffic">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={businessMetrics?.revenueByDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : value,
                    name === 'revenue' ? 'Revenue' : 'Visitors'
                  ]}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                <Bar dataKey="visitors" fill="#3B82F6" name="Visitors" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card title="Revenue by Traffic Source">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={businessMetrics?.topSources || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {businessMetrics?.topSources?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Traffic Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {businessMetrics?.topSources?.map((source, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{source.name}</span>
                </div>
                <span className="font-medium">{formatCurrency(source.revenue)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Analytics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-wider opacity-90">Today's Events</p>
              <p className="mt-2 text-4xl font-bold">{stats.totalEventsToday.toLocaleString()}</p>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-wider opacity-90">Active Users Today</p>
              <p className="mt-2 text-4xl font-bold">{stats.uniqueUsersToday.toLocaleString()}</p>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-wider opacity-90">This Week</p>
              <p className="mt-2 text-4xl font-bold">{stats.totalEventsThisWeek.toLocaleString()}</p>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-wider opacity-90">This Month</p>
              <p className="mt-2 text-4xl font-bold">{stats.totalEventsThisMonth.toLocaleString()}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Action Items & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-4">
            {stats?.topEvents?.slice(0, 5).map((event, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="ml-3 text-gray-900">{event.name}</span>
                </div>
                <span className="text-gray-500 font-medium">{event.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link 
              to="/analytics" 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View detailed analytics →
            </Link>
          </div>
        </Card>
        
        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/analytics"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-blue-600 text-lg mb-2">📊</div>
              <h3 className="text-sm font-medium text-gray-900">Advanced Analytics</h3>
              <p className="text-xs text-gray-500 mt-1">Deep dive into your data</p>
            </Link>
            
            {user?.role === 'admin' && (
              <Link
                to="/users"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-purple-600 text-lg mb-2">👥</div>
                <h3 className="text-sm font-medium text-gray-900">Manage Team</h3>
                <p className="text-xs text-gray-500 mt-1">Add or remove team members</p>
              </Link>
            )}
            
            <Link
              to="/reports"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-green-600 text-lg mb-2">📄</div>
              <h3 className="text-sm font-medium text-gray-900">Generate Reports</h3>
              <p className="text-xs text-gray-500 mt-1">Create custom reports</p>
            </Link>
            
            {user?.role === 'admin' && (
              <Link
                to="/settings"
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-gray-600 text-lg mb-2">⚙️</div>
                <h3 className="text-sm font-medium text-gray-900">Settings</h3>
                <p className="text-xs text-gray-500 mt-1">Configure your dashboard</p>
              </Link>
            )}
          </div>
        </Card>
      </div>

      {/* ROI Calculator */}
      <Card title="💰 ROI Calculator" className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900">Potential Monthly Loss</h4>
            <p className="text-2xl font-bold text-red-600">$28,400</p>
            <p className="text-sm text-gray-600">Without proper analytics tracking</p>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900">With Our Platform</h4>
            <p className="text-2xl font-bold text-green-600">$24,100</p>
            <p className="text-sm text-gray-600">Monthly revenue recovery</p>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900">ROI</h4>
            <p className="text-2xl font-bold text-blue-600">8,033%</p>
            <p className="text-sm text-gray-600">Return on investment</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
            📈 See Detailed ROI Analysis
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;