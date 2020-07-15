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

## Initialization  
  
### Clone this git repo
`git clone https://github.com/Vergil333/GraphQL-Demo`

### Create database
`docker run --name crypto_currencies -e POSTGRES_DB=crypto_currencies -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=simplePass -p 5434:5432 -d postgres`  
to create container with database    
  
`docker rm crypto_currencies`  
to remove container  

### Install node modules
`npm i typescript express node-fetch graphql express-graphql`  
Installs modules globally (all profiles)  

### Install developer modules
`npm i -D ts-node nodemon rimraf @types/node @types/express @types/node-fetch @types/graphql @prisma/cli`  
Installs modules for development (not required for production)  

### Configs
`npm init`  
Creates a package.json  
    
`npx tsc --init`  
Creates a tsconfig.json  

### Setup database
`npx prisma introspect`  
(optional) If tables already exists this takes a look at a database and generates models (into schema.prisma) by existing tables  

`npx prisma migrate save --name create-coin-table --experimental`  
Prepares a [migration] by changes in schema.prisma  
  
`npx prisma migrate up --experimental`  
Launches migration and creates | changes existing tables  

`npx prisma generate`    
Generates new Prisma Client to match new database schema  

## Start up server as developer
`npm run dev`  
Runs script from package.json to start with Nodemon  

## Start up server
`npx ts-node`  
Without arguments (or specify .ts file in argument)  


[migration]: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch-prisma-migrate-typescript-postgres
