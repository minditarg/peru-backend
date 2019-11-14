require('dotenv').config(); // this is important!
module.exports =
  {
    "development": {
      "username": "root",
      "password": null,
      "operatorsAliases": false,
      "database": "peru",
      "host": "localhost",
      "dialect": "mysql",
      "define": {
        "timestamps": true,
        "paranoid": true
      }
    },
    "test": {
      "username": "peru",
      "password": "Peru2019",
      "operatorsAliases": false,
      "database": "peru",
      "host": "50.63.166.215",
      "dialect": "mysql",
      "define": {
        "timestamps": true,
        "paranoid": true
      }
    },
    "production": {
      "username": "peru",
      "password": "Peru2019",
      "operatorsAliases": false,
      "database": "peru",
      "host": "50.63.166.215",
      "dialect": "mysql",
      "define": {
        "timestamps": true,
        "paranoid": true
      }
    }
  }
