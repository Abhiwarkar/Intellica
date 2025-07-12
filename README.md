# React + Vite Full-Stack Application

A modern full-stack web application built with React, Vite, and Node.js, featuring analytics, reporting, and user management capabilities.

## Features

- 🚀 **Fast Development** - Powered by Vite with HMR (Hot Module Replacement)
- 📊 **Analytics Dashboard** - Real-time analytics and user tracking
- 📈 **Reporting System** - Comprehensive reports for user activity and revenue
- 🔐 **Authentication** - Secure user authentication and authorization
- 📱 **Responsive Design** - Mobile-first responsive UI
- 🎯 **Event Tracking** - Custom event tracking and session management

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **JavaScript/JSX** - Programming language
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication tokens

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-name>
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

### Code Quality
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Automatically fix ESLint issues

## Project Structure

```
├── public/                 # Static assets
├── src/                   # Frontend source code
│   ├── components/        # Reusable React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── services/         # API service functions
│   ├── styles/           # CSS files
│   └── main.jsx          # Application entry point
├── server/               # Backend source code
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # Express routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Server entry point
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
└── vite.config.js      # Vite configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `POST /api/analytics/event` - Track custom events
- `GET /api/analytics/events` - Get event history

### Reports
- `GET /api/reports/revenue` - Revenue reports
- `GET /api/reports/user-activity` - User activity reports

## Configuration

### Vite Configuration
The project uses Vite for fast development. Configuration can be found in `vite.config.js`.

### ESLint Configuration
ESLint rules are configured for React development with recommended settings.

## Database Schema

The application uses MongoDB with the following main collections:
- **Users** - User accounts and authentication
- **Events** - Analytics events and tracking data
- **Organizations** - Multi-tenant organization data

## Deployment

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the `dist/` folder to your hosting provider

### Backend Deployment
1. Set production environment variables
2. Deploy to your preferred hosting service (Heroku, AWS, etc.)
3. Ensure MongoDB connection is configured

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `JWT_EXPIRE` | JWT token expiration time | No |
| `PORT` | Server port number | No |
| `NODE_ENV` | Environment (development/production) | No |
| `VITE_API_URL` | Backend API URL for frontend | Yes |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please:
1. Check the [Issues](../../issues) page
2. Create a new issue if your problem isn't already addressed
3. Contact the development team

---

Built with ❤️ using React + Vite
