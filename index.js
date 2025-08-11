const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Express API',
      version: '1.0.0',
      description: 'A simple Express API'
    }
  },
  apis: ['./router/*.js']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)  // <--- this was missing

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

mongoose
  .connect('mongodb://localhost:27017/testdb')
  .then(() => {
    console.log('connected to mongoDB')
  })
  .catch(err => {
    console.log(err)
  })

app.use('/users', require('./router/users'))

app.listen(3000, () => {
  console.log('I am listening to port 3000')
})
