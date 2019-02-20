# Faluche-troyenne-api

API du site de présentation et d'inscription aux événements organisés par la Faluche Troyenne

## Requirements

* [Node.js](https://nodejs.org/)
* [yarn](https://yarnpkg.com/)

## Installation

```
git clone https://github.com/Fleuh/faluche-troyenne-api.git
# or
git clone git@github.com:Fleuh/faluche-troyenne-api.git

cd faluche-troyenne-api
yarn
```

## Database

```
# create the databse 'wet', should be in utf8 not utf8mb4, otherwise it wont work

CREATE DATABASE wet CHARACTER SET utf8;

# create user 'wet' with password 'wet', you can changed those, but it must match env variables

CREATE USER 'wet'@'localhost' IDENTIFIED BY 'wet';
GRANT ALL PRIVILEGES ON wet.* TO 'wet'@'localhost';
Flush privileges;
```

## Configuration

```
# copy env file for all environments
cp .env .env.local
# makes your changes in .env.local, which will not be pushed
nano .env.local
# you should change DB settings for your database
```


## Commands

```
yarn dev    # development server
yarn start  # production server
yarn serve  # pm2 production server (load balancing)
yarn reload # pm2 hot reload
yarn lint   # prettier lint
```

## Structure

```
arena.utt.fr-api/
├── src/                          # base directory
│   ├── api/                         # api files
│   │   ├── controllers/                # endpoints controllers
│   │   ├── middlewares/                # endpoints middlewares
│   │   ├── models/                     # database models
│   │   └── utils/                      # utils files
│   ├── main.js                       # create express server
│   ├── database.js                  # create sequelize connection
│   ├── env.js                       # convert .env and .env.local to JSON
│   ├── index.js                     # entry point
├── .editorconfig                 # define your editor options
├── .env                          # global configuration
└── .env.local                    # override global configuration (not pushed to repository)
```
