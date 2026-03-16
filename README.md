# Alumni Data Management System

A comprehensive full-stack web application for managing alumni data, including profiles, achievements, projects, jobs, donations, and degrees. Built with React frontend and Node.js/Express backend with MySQL database.

## Features

- **User Authentication**: Secure login for alumni and admins
- **Alumni Profiles**: Manage personal information, contact details, and batch information
- **Academic Records**: Track degrees, institutions, and specializations
- **Career Tracking**: Record job positions, companies, and locations
- **Achievements**: Document notable accomplishments and awards
- **Projects**: Showcase personal and professional projects
- **Donations**: Track alumni contributions and purposes
- **Admin Dashboard**: Administrative controls and oversight
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Frontend
- **React 19** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL2** - MySQL database client
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Database
- **MySQL** - Relational database management system

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd B230034CS_Alumni_Data_Management_System
   ```

2. **Set up the database**
   - Install and start MySQL server
   - Create a new database (the schema will create `alumni_db`)
   - Run the database schema:
     ```bash
     mysql -u your_username -p < database/schema.sql
     ```

3. **Configure database connection**
   - Update `backend/config/db.js` with your MySQL credentials:
     ```javascript
     const db = mysql.createConnection({
       host: 'localhost',
       user: 'your_username',
       password: 'your_password',
       database: 'alumni_db'
     });
     ```

4. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

5. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## Usage

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

3. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - Login with sample credentials:
     - **Admin**: admin@alumni.com / admin123
     - **Alumni**: john@example.com / john123 or jane@example.com / john123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Alumni registration

### Alumni Management
- `GET /api/alumni` - Get all alumni
- `GET /api/alumni/:id` - Get specific alumni
- `PUT /api/alumni/:id` - Update alumni profile
- `DELETE /api/alumni/:id` - Delete alumni

### Degrees
- `GET /api/degrees/:alumniId` - Get degrees for alumni
- `POST /api/degrees` - Add new degree
- `PUT /api/degrees/:id` - Update degree
- `DELETE /api/degrees/:id` - Delete degree

### Achievements
- `GET /api/achievements/:alumniId` - Get achievements for alumni
- `POST /api/achievements` - Add new achievement
- `PUT /api/achievements/:id` - Update achievement
- `DELETE /api/achievements/:id` - Delete achievement

### Projects
- `GET /api/projects/:alumniId` - Get projects for alumni
- `POST /api/projects` - Add new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Jobs
- `GET /api/jobs/:alumniId` - Get jobs for alumni
- `POST /api/jobs` - Add new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Donations
- `GET /api/donations/:alumniId` - Get donations for alumni
- `POST /api/donations` - Add new donation
- `PUT /api/donations/:id` - Update donation
- `DELETE /api/donations/:id` - Delete donation

## Project Structure

```
B230034CS_Alumni_Data_Management_System/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/              # Route controllers
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/                  # API routes
│   ├── package.json
│   └── server.js                # Main server file
├── database/
│   └── schema.sql               # Database schema
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── utils/               # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Development

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend linting
cd frontend
npm run lint
```

### Building for Production
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- Built as part of academic project B230034CS
- Uses modern web technologies for scalable alumni management
- Designed for educational institutions to maintain alumni networks</content>
