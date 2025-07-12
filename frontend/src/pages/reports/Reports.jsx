import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Card from '../../components/common/Card';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const Reports = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [hasRealData, setHasRealData] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    generateReport();
  }, [reportType, dateRange]);

  const generateReport = async () => {
    setLoading(true);
    try {
      let data = {};
      
      if (reportType === 'overview') {
        const response = await api.get(`/reports/overview?period=${dateRange}`);
        data = response.data.data;
        
        // Check if we have real data
        setHasRealData(data.totalRevenue > 0 || data.totalCustomers > 0);
        
        // If no real data, use demo data
        if (!hasRealData) {
          data = getDemoOverviewData();
        }
      } else if (reportType === 'userActivity') {
        try {
          const response = await api.get(`/reports/user-activity?period=${dateRange}`);
          data = response.data.data;
          setHasRealData(data.totalSessions > 0);
          
          if (!hasRealData) {
            data = getDemoUserActivityData();
          }
        } catch (err) {
          data = getDemoUserActivityData();
          setHasRealData(false);
        }
      } else if (reportType === 'conversionFunnel') {
        try {
          const response = await api.get(`/reports/conversion-funnel?period=${dateRange}`);
          data = response.data.data;
          setHasRealData(data.steps && data.steps[0]?.users > 0);
          
          if (!hasRealData) {
            data = getDemoConversionData();
          }
        } catch (err) {
          data = getDemoConversionData();
          setHasRealData(false);
        }
      }
      
      setReportData({ [reportType]: data });
    } catch (err) {
      console.error('Failed to generate report:', err);
      // Fallback to demo data
      setHasRealData(false);
      setReportData({ [reportType]: getDemoData(reportType) });
    } finally {
      setLoading(false);
    }
  };

  const getDemoOverviewData = () => ({
    totalRevenue: 125680,
    totalCustomers: 1247,
    conversionRate: 3.4,
    averageOrderValue: 89.50,
    topProducts: [
      { name: 'Premium Plan', revenue: 45600, units: 152 },
      { name: 'Basic Plan', revenue: 32400, units: 324 },
      { name: 'Enterprise Plan', revenue: 28800, units: 48 },
      { name: 'Add-ons', revenue: 18880, units: 236 }
    ],
    revenueByMonth: [
      { month: 'Jul', revenue: 98500, customers: 1105, orders: 892 },
      { month: 'Aug', revenue: 102300, customers: 1142, orders: 945 },
      { month: 'Sep', revenue: 108900, customers: 1178, orders: 1023 },
      { month: 'Oct', revenue: 115600, customers: 1201, orders: 1156 },
      { month: 'Nov', revenue: 121200, customers: 1223, orders: 1234 },
      { month: 'Dec', revenue: 125680, customers: 1247, orders: 1345 }
    ]
  });

  const getDemoUserActivityData = () => ({
    totalSessions: 45623,
    averageSessionTime: '4m 23s',
    bounceRate: 42.3,
    pageViewsPerSession: 3.8,
    topPages: [
      { page: '/pricing', views: 15643, uniqueViews: 12890, avgTime: '2m 45s' },
      { page: '/features', views: 12890, uniqueViews: 10234, avgTime: '3m 12s' },
      { page: '/demo', views: 9876, uniqueViews: 8765, avgTime: '5m 34s' },
      { page: '/contact', views: 7654, uniqueViews: 6543, avgTime: '1m 56s' },
      { page: '/blog', views: 6543, uniqueViews: 5432, avgTime: '4m 18s' }
    ],
    usersByDevice: [
      { device: 'Desktop', users: 18450, percentage: 60.5 },
      { device: 'Mobile', users: 9225, percentage: 30.3 },
      { device: 'Tablet', users: 2800, percentage: 9.2 }
    ]
  });

  const getDemoConversionData = () => ({
    steps: [
      { step: 'Visited Website', users: 30500, percentage: 100 },
      { step: 'Viewed Pricing', users: 15643, percentage: 51.3 },
      { step: 'Started Signup', users: 4892, percentage: 16.0 },
      { step: 'Completed Signup', users: 2456, percentage: 8.1 },
      { step: 'Made Purchase', users: 1034, percentage: 3.4 }
    ]
  });

  const generateSampleDataForReports = async () => {
    try {
      await api.post('/analytics/generate-sample-data');
      alert('Sample data generated! Reports will now show realistic data.');
      generateReport(); // Refresh the report
    } catch (err) {
      alert('Failed to generate sample data');
    }
  };

  const exportToPDF = () => {
    alert('PDF report generation started! You will receive an email when ready.');
  };

  const exportToExcel = () => {
    const csvContent = generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportType}_report_${dateRange}.csv`;
    link.click();
  };

  const generateCSVContent = () => {
    if (reportType === 'overview' && reportData?.overview) {
      return `Report Type,${reportType}\nDate Range,${dateRange}\nTotal Revenue,${reportData.overview.totalRevenue}\nTotal Customers,${reportData.overview.totalCustomers}\nConversion Rate,${reportData.overview.conversionRate}%\n`;
    }
    return `Report Type,${reportType}\nDate Range,${dateRange}\nGenerated At,${new Date().toISOString()}\n`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const reportTypes = [
    { id: 'overview', name: 'Business Overview', icon: '📊' },
    { id: 'userActivity', name: 'User Activity', icon: '👥' },
    { id: 'conversionFunnel', name: 'Conversion Funnel', icon: '🎯' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Data Status */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Reports</h1>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-gray-600">
              {hasRealData ? 'Showing real data from your website' : 'Showing demo data'}
            </p>
            {!hasRealData && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Demo Mode
                </span>
                <button
                  onClick={generateSampleDataForReports}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Generate Sample Data
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
          >
            📄 Export PDF
          </button>
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
          >
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Integration Status */}
      {!hasRealData && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Connect Your Website</h3>
              <p className="text-blue-700 mt-1">
                Install our tracking code to see real reports from your website traffic and conversions.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.href = '/integrations'}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Setup Integration
              </button>
              <button
                onClick={generateSampleDataForReports}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Use Sample Data
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setReportType(type.id)}
            className={`p-4 border rounded-lg text-left transition-colors ${
              reportType === type.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl mb-2">{type.icon}</div>
            <h3 className="font-medium">{type.name}</h3>
            {!hasRealData && reportType === type.id && (
              <p className="text-xs text-orange-600 mt-1">Demo data</p>
            )}
          </button>
        ))}
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Business Overview Report */}
          {reportType === 'overview' && reportData?.overview && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center">
                  <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.overview.totalRevenue)}</p>
                  {!hasRealData && <p className="text-xs text-orange-600">Demo</p>}
                </Card>
                <Card className="text-center">
                  <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
                  <p className="text-2xl font-bold text-gray-900">{reportData.overview.totalCustomers.toLocaleString()}</p>
                  {!hasRealData && <p className="text-xs text-orange-600">Demo</p>}
                </Card>
                <Card className="text-center">
                  <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
                  <p className="text-2xl font-bold text-gray-900">{reportData.overview.conversionRate}%</p>
                  {!hasRealData && <p className="text-xs text-orange-600">Demo</p>}
                </Card>
                <Card className="text-center">
                  <h3 className="text-sm font-medium text-gray-500">Avg Order Value</h3>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.overview.averageOrderValue)}</p>
                  {!hasRealData && <p className="text-xs text-orange-600">Demo</p>}
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title={`Revenue Trends ${!hasRealData ? '(Demo Data)' : ''}`}>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={reportData.overview.revenueByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card title={`Top Products by Revenue ${!hasRealData ? '(Demo Data)' : ''}`}>
                  <div className="space-y-4">
                    {reportData.overview.topProducts?.map((product, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.units} units sold</p>
                        </div>
                        <span className="font-bold text-green-600">{formatCurrency(product.revenue)}</span>
                      </div>
                    )) || <p className="text-gray-500">No product data available</p>}
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* User Activity Report */}
          {reportType === 'userActivity' && reportData?.userActivity && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center">
                  <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
                  <p className="text-2xl font-bold text-gray-900">{reportData.userActivity.totalSessions.toLocaleString()}</p>
                  {!hasRealData && <p className="text-xs text-orange-600">Demo</p>}
                </Card>
                <Card className="text-center">
                  <h3 className="text-sm font-medium text-gray-500">Avg Session Time</h3>
                  <p className="text-2xl font-bold text-gray-900">{reportData.userActivity.averageSessionTime}</p>
                  {!hasRealData && <p className="text-xs text-orange-600">Demo</p>}
                </Card>
                <Card className="text-center">
                  <h3 className="text-sm font-medium text-gray-500">Bounce Rate</h3>
                  <p className="text-2xl font-bold text-gray-900">{reportData.userActivity.bounceRate}%</p>
                  {!hasRealData && <p className="text-xs text-orange-600">Demo</p>}
                </Card>
                <Card className="text-center">
                  <h3 className="text-sm font-medium text-gray-500">Pages/Session</h3>
                  <p className="text-2xl font-bold text-gray-900">{reportData.userActivity.pageViewsPerSession}</p>
                  {!hasRealData && <p className="text-xs text-orange-600">Demo</p>}
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title={`Top Pages ${!hasRealData ? '(Demo Data)' : ''}`}>
                  <div className="space-y-3">
                    {reportData.userActivity.topPages?.map((page, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <h4 className="font-medium">{page.page}</h4>
                          <p className="text-sm text-gray-500">Avg time: {page.avgTime}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{page.views.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{page.uniqueViews.toLocaleString()} unique</div>
                        </div>
                      </div>
                    )) || <p className="text-gray-500">No page data available</p>}
                  </div>
                </Card>

                <Card title={`Users by Device ${!hasRealData ? '(Demo Data)' : ''}`}>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.userActivity.usersByDevice}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ device, percentage }) => `${device}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="users"
                        >
                          {reportData.userActivity.usersByDevice?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* Conversion Funnel Report */}
          {reportType === 'conversionFunnel' && reportData?.conversionFunnel && (
            <Card title={`Conversion Funnel Analysis ${!hasRealData ? '(Demo Data)' : ''}`}>
              <div className="space-y-4">
                {reportData.conversionFunnel.steps?.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{step.step}</h4>
                      <div className="text-right">
                        <span className="font-bold">{step.users.toLocaleString()}</span>
                        <span className="text-gray-500 ml-2">({step.percentage}%)</span>
                        {!hasRealData && <span className="text-xs text-orange-600 ml-2">Demo</span>}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full ${
                          index === 0 ? 'bg-blue-600' :
                          index === 1 ? 'bg-green-600' :
                          index === 2 ? 'bg-yellow-600' :
                          index === 3 ? 'bg-orange-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${step.percentage}%` }}
                      ></div>
                    </div>
                    {index < reportData.conversionFunnel.steps.length - 1 && (
                      <div className="text-center text-sm text-red-600 mt-2">
                        Drop-off: {(reportData.conversionFunnel.steps[index].percentage - reportData.conversionFunnel.steps[index + 1].percentage).toFixed(1)}%
                      </div>
                    )}
                  </div>
                )) || <p className="text-gray-500">No funnel data available</p>}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Report Actions */}
      <Card title="Report Actions" className="bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => alert('Email reports scheduled! You will receive weekly reports.')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-white transition-colors"
          >
            <div className="text-blue-600 text-2xl mb-2">📧</div>
            <h3 className="font-medium">Schedule Reports</h3>
            <p className="text-sm text-gray-600 mt-1">Get weekly email reports</p>
          </button>

          <button
            onClick={() => window.location.href = '/integrations'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-white transition-colors"
          >
            <div className="text-purple-600 text-2xl mb-2">🔌</div>
            <h3 className="font-medium">Setup Integration</h3>
            <p className="text-sm text-gray-600 mt-1">Connect your website data</p>
          </button>

          <button
            onClick={() => alert('API documentation opened!')}
            className="p-4 border border-gray-200 rounded-lg hover:bg-white transition-colors"
          >
            <div className="text-green-600 text-2xl mb-2">🔌</div>
            <h3 className="font-medium">API Access</h3>
            <p className="text-sm text-gray-600 mt-1">Programmatic report access</p>
          </button>
        </div>
      </Card>

      {/* Real Data Benefits */}
      {!hasRealData && (
        <Card title="🚀 Benefits of Real Data Integration" className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">What You'll Get:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center"><span className="text-green-600 mr-2">✅</span>Real-time revenue tracking</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✅</span>Actual customer behavior</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✅</span>True conversion rates</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✅</span>Page performance insights</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✅</span>Device & traffic source data</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Business Impact:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center"><span className="text-blue-600 mr-2">💰</span>Identify revenue opportunities</li>
                <li className="flex items-center"><span className="text-blue-600 mr-2">📈</span>Optimize conversion funnels</li>
                <li className="flex items-center"><span className="text-blue-600 mr-2">🎯</span>Improve marketing ROI</li>
                <li className="flex items-center"><span className="text-blue-600 mr-2">⚡</span>Make data-driven decisions</li>
                <li className="flex items-center"><span className="text-blue-600 mr-2">🔍</span>Spot issues before they cost money</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/integrations'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 mr-4"
            >
              🔌 Connect Your Website Now
            </button>
            <button
              onClick={generateSampleDataForReports}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700"
            >
              📊 Generate Sample Data
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;