# GameSpot-API

A backend api mainly responsible for role based CRUD operations and processing returns and rental requests.

## What is GameSpot?

GameSpot is a service that allows easy management for games as well as customers and rentals. It lets users add games and customer information to the database for future rental opportunities and eventually processing the return while setting the date out, date returned, and the rental fee.

- the frontend client codebase can be found [HERE](https://github.com/a-maystorov/gamespot-client)

## Technologies:

- JavaScript

- Node

- Express

- MongoDB

- Mongoose

- Testing:

  - Jest

- Dependencies:

  - joi and joi-objectid

  - lodash

  - moment

  - jsonwebtoken

  - winston

  - cors

  - bcrypt

## Tests:

- Over 97% coverage with passing results.

![api-tests](https://user-images.githubusercontent.com/76817540/179432217-00f4a222-b0fa-4b6d-9055-c001f9edb416.jpeg)

  - Example of a passing test suite:
  
  ![customers-test-suite](https://user-images.githubusercontent.com/76817540/179432249-9f53b7e4-3c23-43f9-9c82-b6758691502d.jpeg)

## Installation

1. Download the ZIP files or clone the repo.

2. Navigate to the project root directory using your terminal and IDE of choice.

3. Run `npm install` to install all of the project dependencies.

4. Change mongodb connection string in the startup folder and seed.js file to your preference.

5. In the terminal run `node seed.js` to populate the database with some games and genres.

6. Run `node app.js` to start the server.

  - for testing run `npm run test`

> :warning: **The frontend for this project has been build and if you would like to only do some basic testing I recommend visiting the hosted project**

- [Hosted project](https://gamespotz.netlify.app/games)

## Example of a collection in Compass:

![alt text](https://github.com/SirDev97/GameSpot-API/blob/main/assets/compass.jpeg?raw=true)
