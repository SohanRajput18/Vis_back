# Data Visualization Dashboard - Backend API

## Overview
Node.js/Express.js backend API with MongoDB Atlas integration for the Data Visualization Dashboard.

## Features
- RESTful API endpoints for data retrieval
- Advanced filtering and pagination
- MongoDB Atlas integration with Mongoose ODM
- Rate limiting and security middleware
- Error handling and validation
- Analytics and statistics endpoints

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/data-visualization?retryWrites=true&w=majority
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

4. Start the development server:
```bash
npm run dev
```

## MongoDB Atlas Setup

### 1. Create Atlas Cluster
- Go to [MongoDB Atlas](https://cloud.mongodb.com/)
- Create a free account or sign in
- Create a new cluster (M0 Free tier recommended)

### 2. Configure Database Access
- Create a database user with read/write permissions
- Note down username and password

### 3. Configure Network Access
- Add your IP address or use `0.0.0.0/0` for all IPs
- This allows your application to connect to Atlas

### 4. Get Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` and `<dbname>` with your values

### 5. Create Database and Collection
- Use MongoDB Compass or Atlas Data Explorer
- Create database named `data-visualization`
- Create collection named `insights`
- Import your data with the required schema

## API Endpoints

### Data Endpoints
- `GET /api/data` - Get all data with optional filtering
- `GET /api/data/filter-options` - Get available filter options
- `GET /api/data/analytics` - Get analytics and statistics

### Query Parameters for `/api/data`
- `endYear` - Filter by end year
- `topics` - Filter by topics (partial match)
- `sector` - Filter by sector (partial match)
- `region` - Filter by region (partial match)
- `country` - Filter by country (partial match)
- `city` - Filter by city (partial match)
- `pestle` - Filter by PESTLE category
- `source` - Filter by source (partial match)
- `swot` - Filter by SWOT category
- `page` - Page number for pagination (default: 1)
- `limit` - Items per page (default: 1000)
- `sortBy` - Sort field (default: 'year')
- `sortOrder` - Sort order: 'asc' or 'desc' (default: 'asc')

### Example Requests
```bash
# Get all data
GET /api/data

# Get filtered data
GET /api/data?country=India&topics=renewable&page=1&limit=10

# Get filter options
GET /api/data/filter-options

# Get analytics
GET /api/data/analytics
```

## Database Schema
The MongoDB Atlas `insights` collection uses the following schema:
- `end_year`: String - Target end year
- `intensity`: Number (0-10) - Intensity rating
- `likelihood`: Number (0-5) - Likelihood rating
- `relevance`: Number (0-5) - Relevance rating
- `year`: Number - Publication year
- `country`: String - Country name
- `topics`: String - Topic/subject
- `region`: String - Geographic region
- `city`: String - City name
- `sector`: String - Industry sector
- `pestle`: String - PESTLE category
- `source`: String - Data source
- `swot`: String - SWOT category (Strength/Weakness/Opportunity/Threat)
- `title`: String - Article/report title
- `url`: String - Source URL
- `published`: Date - Publication date
- `added`: Date - Date added to database

## Security Features
- Helmet.js for security headers
- CORS configuration
- Rate limiting (1000 requests per 15 minutes)
- Input validation and sanitization
- Error handling without sensitive data exposure

## Development
- `npm run dev` - Start with nodemon for auto-restart
- `npm start` - Start production server

## Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB Atlas connection string
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGINS` - Allowed CORS origins

## Data Import

### Using MongoDB Compass
1. Connect to your Atlas cluster
2. Navigate to `data-visualization` database
3. Open `insights` collection
4. Click "Add Data" → "Insert Document"
5. Add your data with the required schema

### Using Atlas Data Explorer
1. In Atlas dashboard, go to "Browse Collections"
2. Select your database and `insights` collection
3. Click "Insert Document" to add data

### Sample Document
```json
{
  "end_year": "2023",
  "intensity": 8,
  "likelihood": 4,
  "relevance": 5,
  "year": 2023,
  "country": "United States",
  "topics": "renewable energy",
  "region": "Northern America",
  "city": "New York",
  "sector": "Energy",
  "pestle": "Environmental",
  "source": "Reuters",
  "swot": "Opportunity",
  "title": "Renewable Energy Growth in 2023",
  "url": "https://example.com/article",
  "published": "2023-01-15T00:00:00.000Z",
  "added": "2023-01-20T00:00:00.000Z"
}
```