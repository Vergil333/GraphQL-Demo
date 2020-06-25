## Task

Use these technologies: Node.js, Framework Express, Prisma, Typescript, Docker, deploy to Heroku/Google cloud

- Implement simple GraphQL API
- Query returns a list of crypto currencies
- if the database of crypto currencies is empty, update it via REST call https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
- Filter by ID
- Fultext search by name
- Mutation to add new crypto currency with params id, symbol, name
- Accept parameter to force update of crypto currencies without deleting custom-added currencies
