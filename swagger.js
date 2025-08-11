// swagger.js
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'Simple API documentation using Swagger'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./app.js']
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec
