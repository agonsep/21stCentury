# First Node.js and React App

A full-stack web application built with Node.js/Express backend and React frontend.

## Project Structure

```
first-node-app/
├── backend/           # Express.js backend
│   ├── server.js      # Main server file
│   ├── package.json   # Backend dependencies
│   └── .env          # Environment variables
├── frontend/         # React frontend
│   ├── src/          # React source code
│   │   ├── components/  # React components
│   │   ├── App.js      # Main React component
│   │   └── index.js    # React entry point
│   ├── public/       # Static files
│   └── package.json  # Frontend dependencies
└── package.json      # Root package.json with scripts
```

## Features

- **Backend (Node.js/Express)**:
  - RESTful API endpoints
  - CORS enabled for frontend communication
  - Basic user management (GET, POST)
  - Health check endpoint
  - Environment configuration

- **Frontend (React)**:
  - Modern React with hooks
  - Component-based architecture
  - API integration with axios
  - Responsive design
  - Form handling and validation

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone or download this project
2. Install all dependencies (root, backend, and frontend):

```bash
npm run install-all
```

Alternatively, install manually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Running the Application

### Development Mode (Recommended)

Run both backend and frontend simultaneously:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

### Running Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

**Production mode:**
```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Server health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

### Example API Usage

```javascript
// Get all users
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data));

// Create a new user
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
});
```

## Environment Variables

Create a `.env` file in the `backend` directory:

```
PORT=5000
NODE_ENV=development
```

## Building for Production

Build the React frontend:

```bash
npm run build
```

This creates a `build` folder in the frontend directory with optimized production files.

## Technologies Used

### Backend
- Node.js
- Express.js
- CORS
- dotenv

### Frontend
- React 18
- Axios (for API calls)
- CSS3

### Development Tools
- Nodemon (backend auto-restart)
- React Scripts (frontend development server)
- Concurrently (run multiple npm scripts)

## Next Steps

This skeleton provides a solid foundation. Consider adding:

- Database integration (MongoDB, PostgreSQL, etc.)
- User authentication and authorization
- Input validation and sanitization
- Error logging
- Unit and integration tests
- Deployment configuration
- State management (Redux, Context API)
- Routing (React Router)

## Troubleshooting

**Backend not starting:**
- Check if port 5000 is available
- Verify Node.js is installed
- Check for syntax errors in server.js

**Frontend not connecting to backend:**
- Ensure backend is running on port 5000
- Check the proxy setting in frontend/package.json
- Verify CORS is enabled in backend

**Dependencies issues:**
- Delete node_modules folders and run `npm run install-all` again
- Clear npm cache: `npm cache clean --force`