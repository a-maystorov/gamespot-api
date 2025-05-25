# GameSpot API

![Node.js](https://img.shields.io/badge/Node.js-16.14.0-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.1-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4.7-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-6.4.3-880000?logo=mongoose&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-28.1.2-C21325?logo=jest&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-8.5.1-000000?logo=json-web-tokens&logoColor=white)

A production-ready RESTful API for game rental management with comprehensive role-based authentication, robust error handling, and extensive test coverage. This backend service powers the GameSpot platform - a complete solution for managing game inventory, customer information, and rental operations.

## 🎮 What is GameSpot?

GameSpot is a full-featured game rental management system that streamlines the process of tracking inventory, managing customers, and processing rentals. The platform allows administrators to:

- Maintain a catalog of games with detailed information
- Manage customer records
- Process rental transactions
- Handle returns and calculate rental fees automatically
- Access comprehensive reports and analytics

**Frontend client:** [GameSpot Client Repository](https://github.com/a-maystorov/gamespot-client)  
**Live Demo:** [GameSpot Live Demo](https://gamespotz.netlify.app/games)

## ✨ Features

- **RESTful API Architecture**: Clean, well-structured endpoints following REST principles
- **Role-Based Access Control**: Secure authorization system with admin and user roles
- **Comprehensive Validation**: Request validation using Joi schemas with custom validators
- **MongoDB Integration**: Efficient data persistence with Mongoose ODM
- **Complete Game Management**: CRUD operations for games, genres, customers, and rentals
- **Automated Rental Fee Calculation**: Smart fee computation based on rental duration
- **JWT Authentication**: Secure user authentication system
- **Error Handling**: Centralized error handling with detailed logging
- **Extensive Testing**: 97%+ test coverage with Jest and Supertest
- **Data Seeding**: Automated database population for development and testing

## 🛠️ Technology Stack

### Core Technologies

- **Node.js**: JavaScript runtime environment
- **Express**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for secure authentication

### Validation & Processing

- **Joi**: Schema validation with custom extensions
- **Moment.js**: Advanced date manipulation and calculations
- **Lodash**: Utility library for data manipulation

### Security & Operations

- **Bcrypt**: Secure password hashing
- **Helmet**: HTTP header security
- **Winston**: Advanced logging system
- **Compression**: Response compression
- **CORS**: Cross-Origin Resource Sharing support

### Testing

- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertions for API testing

## 🏗️ Architecture

GameSpot API follows a modular architecture with clean separation of concerns:

```
├── middleware/       # Express middleware (auth, validation, error handling)
├── models/           # Mongoose models and validation schemas
├── routes/           # API routes and controllers
├── startup/          # Initialization modules for various components
├── tests/            # Comprehensive test suites
├── app.js            # Main application entry point
└── seed.js           # Database seeding utility
```

## 🚀 API Endpoints

### Authentication

- `POST /api/auth`: Authenticate user and generate JWT token

### Users

- `GET /api/users/me`: Get current user profile
- `POST /api/users`: Register a new user

### Games

- `GET /api/games`: List all games
- `GET /api/games/:id`: Get game details
- `POST /api/games`: Create a new game (auth required)
- `PUT /api/games/:id`: Update game (auth required)
- `DELETE /api/games/:id`: Delete game (admin required)

### Genres

- `GET /api/genres`: List all genres
- `GET /api/genres/:id`: Get genre details
- `POST /api/genres`: Create a new genre (auth required)
- `PUT /api/genres/:id`: Update genre (auth required)
- `DELETE /api/genres/:id`: Delete genre (admin required)

### Customers

- `GET /api/customers`: List all customers
- `GET /api/customers/:id`: Get customer details
- `POST /api/customers`: Create a new customer (auth required)
- `PUT /api/customers/:id`: Update customer (auth required)
- `DELETE /api/customers/:id`: Delete customer (admin required)

### Rentals

- `GET /api/rentals`: List all rentals
- `GET /api/rentals/:id`: Get rental details
- `POST /api/rentals`: Create a new rental (auth required)

### Returns

- `POST /api/returns`: Process a game return (auth required)

## 🧪 Testing

GameSpot API boasts over 97% test coverage with comprehensive test suites for all endpoints and business logic.

![API Test Coverage](https://user-images.githubusercontent.com/76817540/179432217-00f4a222-b0fa-4b6d-9055-c001f9edb416.jpeg)

Example of a passing test suite:

![Customer Tests](https://user-images.githubusercontent.com/76817540/179432249-9f53b7e4-3c23-43f9-9c82-b6758691502d.jpeg)

## 💻 Installation & Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)

### Installation Steps

1. Clone the repository

   ```bash
   git clone https://github.com/a-maystorov/gamespot-api.git
   cd gamespot-api
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Configure environment variables

   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=3000
     DB_CONNECTION_STRING=your_mongodb_connection_string
     JWT_PRIVATE_KEY=your_jwt_secret
     ```

4. Seed the database with initial data

   ```bash
   node seed.js
   ```

5. Start the server

   ```bash
   npm start
   ```

6. Run tests
   ```bash
   npm test
   ```

## 📊 Database Schema

![MongoDB Collection Example](https://github.com/SirDev97/GameSpot-API/blob/main/assets/compass.jpeg?raw=true)

## 🚀 Deployment

The API is configured for easy deployment to platforms like Vercel, Heroku, or any Node.js hosting service.

## 🌟 Technical Highlights

- **Custom Middleware**: Specialized middleware for authentication, error handling, and object ID validation
- **Advanced Validation**: Comprehensive request validation with custom Joi extensions
- **Test-Driven Development**: Extensive test suite ensuring reliability and correctness
- **Structured Logging**: Winston integration for detailed application logs
- **API Security**: Implementation of security best practices with Helmet and proper authentication

## 📄 License

ISC

---

© 2023 GameSpot API - Developed by Alkin Maystorov
