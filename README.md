Intellica

A modern, full-stack SaaS business intelligence platform built with React and Node.js. Track user behavior, analyze business metrics, and generate comprehensive reports for data-driven decision making.

🚀 Features
Core Analytics

Real-time Event Tracking - Track user interactions, page views, purchases, and custom events
Business Metrics Dashboard - Revenue tracking, conversion rates, customer analytics
User Behavior Analysis - Session tracking, bounce rates, device analytics
Conversion Funnel Analysis - Track user journey from visitor to customer

Advanced Reporting

Business Overview Reports - Revenue trends, customer growth, top products
User Activity Reports - Page performance, session analytics, device breakdown
Conversion Funnel Reports - Step-by-step conversion analysis
Export Capabilities - PDF and CSV report exports

Multi-tenant Architecture

Organization Management - Isolated data per organization
Role-based Access Control - Admin, Analyst, and Viewer roles
User Management - Team member invitation and management
API Key Management - Secure data collection

Integration Platform

Website Integration - Easy JavaScript tracking code
REST API - Programmatic data collection
Webhook Support - Real-time event notifications
Multiple Platform Support - WordPress, Shopify, React/Vue ready

🛠️ Tech Stack
Backend

Node.js with Express.js
MongoDB with Mongoose ODM
JWT Authentication
bcryptjs for password hashing
CORS enabled for cross-origin requests
Helmet for security headers
Rate limiting with express-rate-limit

Frontend

React 18 with Vite
React Router for navigation
Tailwind CSS for styling
Recharts for data visualization
Axios for API calls
Context API for state management

Infrastructure

Vercel deployment ready
Environment variable configuration
Error handling middleware
Request logging with Morgan
## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhiwarkar/Intellica
   cd Intellica
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/your-database
   
   # JWT
   JWT_SECRET=your-jwt-secret-key
   JWT_EXPIRE=30d
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Frontend
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run dev:client    # Frontend only
   npm run dev:server    # Backend only
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000` to see the application.

## Available Scripts

### Development
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend development server
- `npm run dev:server` - Start only the backend development server

### Building
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build locally

📖 API Documentation
Authentication Endpoints
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

Analytics Endpoints
POST /api/analytics/events
GET  /api/analytics/events
GET  /api/analytics/overview
GET  /api/analytics/users
POST /api/analytics/generate-sample-data

Reports Endpoints
GET /api/reports/overview?period=30d
GET /api/reports/user-activity?period=30d
GET /api/reports/conversion-funnel?period=30d

User Management EndpointsGET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

👥 User Roles
Admin

Full access to all features
User management capabilities
Organization settings control
Billing and subscription management

Analyst

Access to analytics and reports
Can generate and export reports
View conversion funnels
Cannot manage users or settings

Viewer

Read-only access to dashboard
Basic analytics viewing
Limited report acces

🔒 Security Features

JWT Authentication with secure token handling
Password Hashing with bcryptjs
Rate Limiting to prevent API abuse
CORS Configuration for secure cross-origin requests
Helmet Security Headers for enhanced security
Input Validation and sanitization
Role-based Access Control for feature protection

Generate Sample Data
Use the built-in sample data generator for testing:

Login to the dashboard
Navigate to Analytics
Click "Generate Sample Data"
Or use the API: POST /api/analytics/generate-sample-data


### Vite Configuration
The project uses Vite for fast development. Configuration can be found in `vite.config.js`.

### ESLint Configuration
ESLint rules are configured for React development with recommended settings.


Built with ❤️ By Abhishek Hiwarkar 
