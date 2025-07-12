import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  
  // General settings form state
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: 'Your Organization',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
  });
  
  // Integration settings form state
  const [integrationSettings, setIntegrationSettings] = useState({
    enableTracking: true,
    trackPageViews: true,
    trackClicks: true,
    enableGoogleAnalytics: false,
    googleAnalyticsId: '',
  });
  
  // Handle general settings form change
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
  };
  
  // Handle integration settings form change
  const handleIntegrationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setIntegrationSettings({
      ...integrationSettings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
 const handleGeneralSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.put('/settings/general', generalSettings);
    // Show success message
    alert('Settings saved successfully');
  } catch (err) {
    console.error('Failed to save settings:', err);
    alert(err.response?.data?.error || 'Failed to save settings');
  }
};

const handleIntegrationSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.put('/settings/integrations', integrationSettings);
    // Show success message
    alert('Integration settings saved successfully');
  } catch (err) {
    console.error('Failed to save integration settings:', err);
    alert(err.response?.data?.error || 'Failed to save integration settings');
  }
};
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`${
                activeTab === 'general'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`${
                activeTab === 'integrations'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Integrations
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`${
                activeTab === 'billing'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Billing
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'general' && (
            <form onSubmit={handleGeneralSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure general settings for your organization.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="organizationName" className="label">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      className="input"
                      value={generalSettings.organizationName}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className="label">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      name="timezone"
                      className="input"
                      value={generalSettings.timezone}
                      onChange={handleGeneralChange}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dateFormat" className="label">
                      Date Format
                    </label>
                    <select
                      id="dateFormat"
                      name="dateFormat"
                      className="input"
                      value={generalSettings.dateFormat}
                      onChange={handleGeneralChange}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          )}
          
          {activeTab === 'integrations' && (
            <form onSubmit={handleIntegrationSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Integration Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure how analytics data is collected and integrated with other services.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enableTracking"
                        name="enableTracking"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={integrationSettings.enableTracking}
                        onChange={handleIntegrationChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enableTracking" className="font-medium text-gray-700">
                        Enable Analytics Tracking
                      </label>
                      <p className="text-gray-500">
                        Collect analytics data from your applications.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="trackPageViews"
                        name="trackPageViews"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={integrationSettings.trackPageViews}
                        onChange={handleIntegrationChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="trackPageViews" className="font-medium text-gray-700">
                        Track Page Views
                      </label>
                      <p className="text-gray-500">
                        Automatically track page views on your website.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="trackClicks"
                        name="trackClicks"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={integrationSettings.trackClicks}
                        onChange={handleIntegrationChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="trackClicks" className="font-medium text-gray-700">
                        Track Button Clicks
                      </label>
                      <p className="text-gray-500">
                        Automatically track button clicks on your website.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="enableGoogleAnalytics"
                        name="enableGoogleAnalytics"
                        type="checkbox"
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={integrationSettings.enableGoogleAnalytics}
                        onChange={handleIntegrationChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="enableGoogleAnalytics" className="font-medium text-gray-700">
                        Enable Google Analytics Integration
                      </label>
                      <p className="text-gray-500">
                        Send data to Google Analytics in addition to our analytics platform.
                      </p>
                    </div>
                  </div>
                  
                  {integrationSettings.enableGoogleAnalytics && (
                    <div className="ml-7 mt-3">
                      <label htmlFor="googleAnalyticsId" className="label">
                        Google Analytics ID
                      </label>
                      <input
                        type="text"
                        id="googleAnalyticsId"
                        name="googleAnalyticsId"
                        className="input"
                        placeholder="UA-XXXXXXXXX-X"
                        value={integrationSettings.googleAnalyticsId}
                        onChange={handleIntegrationChange}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          )}
          
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure how and when you receive notifications.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Coming Soon</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Notification settings will be available in a future update. Stay tuned!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Billing Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your subscription and payment methods.
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Current Plan</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>You are currently on the Free plan.</p>
                  </div>
                  <div className="mt-5">
                    <Button variant="primary">Upgrade Plan</Button>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Method</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>No payment method on file.</p>
                  </div>
                  <div className="mt-5">
                    <Button variant="secondary">Add Payment Method</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;