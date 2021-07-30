# Employee-management-API

[![Build Status](https://travis-ci.org/RedJanvier/Employee-management-API.svg?branch=develop)](https://travis-ci.org/RedJanvier/Employee-management-API)
[![Maintainability](https://api.codeclimate.com/v1/badges/19cd4a6e5a087888aa96/maintainability)](https://codeclimate.com/github/RedJanvier/Employee-management-API/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/RedJanvier/Employee-management-API/badge.svg?branch=develop)](https://coveralls.io/github/RedJanvier/Employee-management-API?branch=develop)

A REST API to manage your employees easily and with bulk add employees and specific employee tracking.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on your own live system.

### Prerequisites

You need to have:

- NodeJs Runtime if not [download it here](https://nodejs.org/en/)
- PostgreSQL Database if not [download it here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
- Git Version Control if not [download it here](https://git-scm.com/downloads)

To check The Prerequisites are installed you can use these terminal commands:

For NodeJs: `node --version`

For Postgres: `psql --version`

For Git: `git --version`

### Installing

A step by step series of examples that tell you how to get a development env running

Clone the Repo with the terminal command:

```bash
git clone https://github.com/RedJanvier/Employee-management-API.git
```

then make a file called .env using sample.env by replacing with your own data.

Run the command inside the cloned directory:

```bash
npm install
```

To start the app in development run the command:

```bash
npm run dev
```

## Built With

- [NodeJS](https://nodejs.org/en/) - The javascript runtime used
- [ExpressJS](http://expressjs.com//) - The web framework used
- [NPM](http://npmjs.com/) - Dependency Management
- [PostgreSQL](https://www.postgres.org/) - Database system used
- [Sequelize](http://sequelize.org/) - Database management system (DBMS) used
- [NodeMailer](https://nodemailer.com/about/) - Email client system used

## Author

- **RedJanvier** - _uzakuraHub_ - [RedJanvier](https://redjanvier.uzakurahub.xyzz)

See also the list of [contributors](https://github.com/RedJanvier/Employee-management-API.git/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

### Documentation

The documentation of full endpoints and all the requirements can be found at the root endpoint of the API or [here](https://documenter.getpostman.com/view/8357211/SzYW2euW?version=latest)
