# GameSpot-API

The backend-api for my fullstack video game rental service project with the main focus being around mastering express, mongodb and mongoose.

## What is GameSpot?

GameSpot is a project build with the intent of keeping track of the games, customers and rentals of an imaginary video game rental service. The employees of the service are only able to view the games that are in stock initially until they create an account after which they will be able to perform basic CRUD operations and view pages which require authentication with some restrictions (only admins can delete games from the database for example). The project was my intro to unit and integration testing also making use of the best practices to my knowledge including error handling, making everything maintainable and scalable as best I could.

## Operations the users can commit after an account creation and logging in:

- Create, edit and get customer data.

- Create, edit and get game data.

- Create, edit and get game genres.

- Create rentals and returns.

- Delete operation on all routes only reserved for admin users.

## Technologies:

- JavaScript

- Node

- Express

- MongoDB

- Mongoose

- Testing:

  - Jest

- Dependencies:

  - fawn

  - joi and joi-objectid

  - lodash

  - moment

  - jsonwebtoken

  - winston

  - cors

  - bcrypt

## Setup

To run this project, install it locally using npm:

> :warning: **The project is still not deployed meaning the database only can run locally for the time beign**: With this in mind you would need to connect to your own local mongo database. You can find everything you need for this in the db.js file in the startup folder.

1. Download the ZIP files.

2. Navigate to the project root directory using your terminal of choice (I use Ubuntu).

3. Run `npm install` to install all of the project dependencies.

4. Run `code .` to open your code editor.

5. In the terminal run `node seed.js` to populate the database with some games and genres.

6. Run `node app.js` to start the server.

7. You can view all of the games only your local port: http://localhost:`Your Port Here`/api/games

   - Note: You can view the data but cannot change any of it without an account, you would need to change the port in the app.js file to your desired port or you will not see anything.

## Preview of seeded game in the browser and mongoDB Compass:

![alt text](https://github.com/SirDev97/the-horde/blob/main/src/assets/dashboard.jpeg?raw=true)

![alt text](https://github.com/SirDev97/the-horde/blob/main/src/assets/create.jpeg?raw=true)
