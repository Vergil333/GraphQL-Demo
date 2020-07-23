## Task

Use these technologies: Node.js, Framework Express, Prisma, Typescript, Docker, deploy to Heroku/Google cloud

- Implement simple GraphQL API
- Query returns a list of crypto currencies
- if the database of crypto currencies is empty, update it via REST call from https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
- Filter by ID
- Fulltext search by name
- Mutation to add new crypto currency with params id, symbol, name
- Accept a parameter to force update of crypto currencies without deleting custom-added currencies

---

## Prerequisites  
- docker (for creating our database)
- NPM (Node Package Manager) 
- set required environment variables
- Heroku CLI for deploying app to cloud
---
## Quick start or TL;DR  

###### Create database
`docker run --name crypto_currencies -e POSTGRES_DB=crypto_currencies -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=simplePass -p 5434:5432 -d postgres`  
creates postgres container with database and user running at port 5434   
(`docker rm crypto_currencies` to remove container)  

###### Clone this git repo
`git clone https://github.com/Vergil333/GraphQL-Demo`  

###### NPM install
`cd GraphQL-Demo`  
`npm install`  
install all dependencies from package.json  

###### Clone this git repo  
`git clone https://github.com/Vergil333/GraphQL-Demo`

###### Set environment variables
`export PORT=3000`  
`export NODE_ENV=development`    
`export DATABASE_URL=postgresql://admin:simplePass@localhost:5434/crypto_currencies?schema=public`  
in Windows replace `export` by `SET`.  
  
###### Create DB table from Prisma Model
`npx prisma migrate save --name create-coin-table --experimental`  
`npx prisma migrate up --experimental`  
---

## Example queries  
Queries
```
   # Get a single coin by id
   query Coin($cg_id: String) {
     coin(cg_id: $cg_id) {
       cg_id
       name
       symbol
     }
   }
   
   # Get a set of coins by partial match in name
   query Coins($name: String) {
     coins(name: $name) {
       cg_id
       name
       symbol
     }
   }
   
   # Create a new coin
   mutation CreateCoin($input: NewCoin!) {
     createCoin(input: $input) {
       cg_id
       name
       symbol
     }
   }
```
Variables
```
{
  "cg_id": "m2-coin",
  "name": "very",
  "input": {
    "cg_id": "m2-coinX",
    "name": "My very own M2-coin!",
    "symbol": "m2-coinX"
  }
}
```

---
## Building project  
These are steps I had to take to create this project.

###### Create database
`docker run --name crypto_currencies -e POSTGRES_DB=crypto_currencies -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=simplePass -p 5434:5432 -d postgres`  
to create container with database    
  
`docker rm crypto_currencies`  
to remove container if you mess something up  

###### Initialize package.json
`npm init`  

###### Install node modules
`npm i typescript express node-fetch graphql express-graphql rimraf @types/node @types/express @types/node-fetch @types/graphql @prisma/cli`  
Installs modules globally (all profiles)  

###### Install developer modules
`npm i -D ts-node nodemon`  
Installs modules for development (not required for production)  

###### Configs
`npx tsc --init`  
Creates a tsconfig.json and then configure this file.  
Also configure package.json (scripts).  

###### Setup database
`npx prisma introspect`  
(optional) If tables already exists this takes a look at a database and generates models (into schema.prisma) by existing tables  

`npx prisma migrate save --name create-coin-table --experimental`  
Prepares a [migration] by changes in schema.prisma  
  
`npx prisma migrate up --experimental`  
Launches migration and creates | changes existing tables.  

`npx prisma generate`    
Generates new Prisma Client to match new database schema.  

## Start server (development)
`npm run dev`  
Runs a script from package.json to start with Nodemon.  

## Start server (production)
`npm start`  
Without arguments (or specify .ts file in argument).  


[migration]: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-prisma-migrate-typescript-postgres
