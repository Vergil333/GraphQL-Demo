## Task

Use these technologies: Node.js, Framework Express, Prisma, Typescript, Docker, deploy to Heroku/Google cloud

- Implement simple GraphQL API
- Query returns a list of crypto currencies
- if the database of crypto currencies is empty, update it via REST call https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
- Filter by ID
- Fulltext search by name
- Mutation to add new crypto currency with params id, symbol, name
- Accept a parameter to force update of crypto currencies without deleting custom-added currencies

---

## Initialization  
  
### Clone this git repo
`git clone https://github.com/Vergil333/GraphQL-Demo`

### Create database
`docker run --name crypto_currencies -e POSTGRES_DB=crypto_currencies -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=simplePass -p 5434:5432 -d postgres` to create container with database  
  
`docker rm crypto_currencies ` to remove container  

### Install node modules
`npm i typescript express node-fetch @types/node-fetch` // installs modules globally (all profiles)  

### Install developer modules
`npm i -D ts-node nodemon rimraf @types/node @types/express @prisma/cli` // installs modules for development (not required for production)  

### Configs
`npm init` // creates a package.json    
`npx tsc --init` // creates a tsconfig.json  

## Start up server
`npx ts-node` // without arguments (or specify .ts file in argument)
