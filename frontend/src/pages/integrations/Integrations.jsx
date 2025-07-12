import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

const Integrations = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [orgId, setOrgId] = useState('');
  const [activeTab, setActiveTab] = useState('setup');
  const [trackingStatus, setTrackingStatus] = useState('disconnected');

  useEffect(() => {
    // Mock API key generation
    setApiKey('sk_live_' + Math.random().toString(36).substr(2, 32));
    setOrgId(user?.organization || 'org_' + Math.random().toString(36).substr(2, 16));
  }, [user]);

  const trackingCode = `<!-- Analytics Tracking Code -->
<script>
  (function() {
    var analytics = window.analytics = window.analytics || [];
    if (!analytics.initialize) {
      analytics.initialize = function(key) {
        analytics._writeKey = key;
        analytics.load = function() {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.src = 'https://cdn.youranalytics.com/analytics.js';
          document.head.appendChild(script);
        };
        analytics.load();
      };
      
      analytics.track = function(event, properties) {
        fetch('${window.location.origin}/api/analytics/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${apiKey}'
          },
          body: JSON.stringify({
            name: event,
            properties: properties || {},
            timestamp: new Date().toISOString()
          })
        });
      };
      
      analytics.page = function(name, properties) {
        analytics.track('page_view', {
          page: name || document.title,
          url: window.location.href,
          ...properties
        });
      };
      
      analytics.identify = function(userId, traits) {
        analytics.track('user_identify', {
          userId: userId,
          traits: traits || {}
        });
      };
    }
    
    analytics.initialize('${apiKey}');
    analytics.page(); // Auto-track page view
  })();
</script>`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const testIntegration = async () => {
    try {
      await api.post('/analytics/events', {
        name: 'integration_test',
        properties: {
          source: 'dashboard_test',
          timestamp: new Date().toISOString()
        }
      });
      setTrackingStatus('connected');
      alert('Integration test successful! Check your analytics dashboard.');
    } catch (err) {
      alert('Integration test failed. Please check your setup.');
    }
  };

  const regenerateApiKey = () => {
    const newKey = 'sk_live_' + Math.random().toString(36).substr(2, 32);
    setApiKey(newKey);
    alert('New API key generated! Update your tracking code.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600">Connect your data sources and start tracking user behavior</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            trackingStatus === 'connected' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {trackingStatus === 'connected' ? '✅ Connected' : '⚠️ Not Connected'}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'setup', name: 'Quick Setup', icon: '🚀' },
            { id: 'api', name: 'API Credentials', icon: '🔑' },
            { id: 'platforms', name: 'Platforms', icon: '🔌' },
            { id: 'webhooks', name: 'Webhooks', icon: '🔗' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'setup' && (
        <div className="space-y-6">
          <Card title="🚀 Quick Start - Website Integration">
            <div className="space-y-4">
              <p className="text-gray-600">
                Copy and paste this code into your website's <code>&lt;head&gt;</code> section to start tracking immediately.
              </p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <pre>{trackingCode}</pre>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => copyToClipboard(trackingCode)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  📋 Copy Code
                </button>
                <button
                  onClick={testIntegration}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  🧪 Test Integration
                </button>
              </div>
            </div>
          </Card>

          <Card title="📊 Manual Event Tracking">
            <div className="space-y-4">
              <p className="text-gray-600">
                After installing the code above, you can track custom events:
              </p>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Track Purchase:</h4>
                <code className="text-sm">
                  analytics.track('purchase', &#123;<br/>
                  &nbsp;&nbsp;amount: 99.99,<br/>
                  &nbsp;&nbsp;currency: 'USD',<br/>
                  &nbsp;&nbsp;product: 'Premium Plan'<br/>
                  &#125;);
                </code>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Identify User:</h4>
                <code className="text-sm">
                  analytics.identify('user123', &#123;<br/>
                  &nbsp;&nbsp;email: 'user@example.com',<br/>
                  &nbsp;&nbsp;name: 'John Doe',<br/>
                  &nbsp;&nbsp;plan: 'premium'<br/>
                  &#125;);
                </code>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="space-y-6">
          <Card title="🔑 API Credentials">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization ID
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={orgId}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-l-md bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(orgId)}
                    className="px-4 py-3 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-300"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="flex">
                  <input
                    type="password"
                    value={apiKey}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-l-md bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(apiKey)}
                    className="px-4 py-3 bg-gray-200 border border-l-0 border-gray-300 hover:bg-gray-300"
                  >
                    📋
                  </button>
                  <button
                    onClick={regenerateApiKey}
                    className="px-4 py-3 bg-red-600 text-white border border-l-0 border-red-600 rounded-r-md hover:bg-red-700"
                  >
                    🔄
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Keep your API key secure. Regenerating will require updating all integrations.
                </p>
              </div>
            </div>
          </Card>

          <Card title="📡 API Endpoint">
            <div className="space-y-4">
              <p className="text-gray-600">Send events directly to our API:</p>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono">
                <div className="mb-2">
                  <span className="text-blue-400">POST</span> {window.location.origin}/api/analytics/events
                </div>
                <div className="text-gray-400">Headers:</div>
                <div>Authorization: Bearer {apiKey}</div>
                <div>Content-Type: application/json</div>
                <br/>
                <div className="text-gray-400">Body:</div>
                <div>&#123;</div>
                <div>&nbsp;&nbsp;"name": "button_click",</div>
                <div>&nbsp;&nbsp;"properties": &#123;</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;"button_text": "Sign Up",</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;"page": "/landing"</div>
                <div>&nbsp;&nbsp;&#125;</div>
                <div>&#125;</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'platforms' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'WordPress',
                icon: '🗒️',
                status: 'available',
                description: 'Easy plugin installation for WordPress sites'
              },
              {
                name: 'Shopify',
                icon: '🛒',
                status: 'available', 
                description: 'Track e-commerce events and revenue'
              },
              {
                name: 'React/Vue',
                icon: '⚛️',
                status: 'available',
                description: 'NPM package for React and Vue applications'
              },
              {
                name: 'Google Analytics',
                icon: '📊',
                status: 'coming-soon',
                description: 'Import existing GA data'
              },
              {
                name: 'Facebook Pixel',
                icon: '📘',
                status: 'coming-soon',
                description: 'Sync Facebook advertising data'
              },
              {
                name: 'Zapier',
                icon: '⚡',
                status: 'coming-soon',
                description: 'Connect 1000+ apps via Zapier'
              }
            ].map((platform, index) => (
              <Card key={index} className="text-center">
                <div className="text-4xl mb-3">{platform.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{platform.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                <button
                  className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                    platform.status === 'available'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={platform.status !== 'available'}
                >
                  {platform.status === 'available' ? 'Setup' : 'Coming Soon'}
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'webhooks' && (
        <Card title="🔗 Webhook Configuration">
          <div className="space-y-4">
            <p className="text-gray-600">
              Configure webhooks to receive real-time notifications when specific events occur.
            </p>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Event Webhooks</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>New User Registration</span>
                  <button className="text-blue-600 hover:text-blue-800">Configure</button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Purchase Completed</span>
                  <button className="text-blue-600 hover:text-blue-800">Configure</button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Goal Conversion</span>
                  <button className="text-blue-600 hover:text-blue-800">Configure</button>
                </div>
              </div>
            </div>

            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              + Add New Webhook
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Integrations;