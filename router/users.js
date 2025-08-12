const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const User = require('../models/user')

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 success:
 *                   type: boolean
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).send({ users, success: true })
  } catch {
    res.status(404).send({ error: true })
  }
})

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - age
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         age:
 *           type: integer
 *       example:
 *         _id: 60b8d295f1a4e72f8c123456
 *         first_name: Mohammad
 *         last_name: Ali
 *         age: 25
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Validation errors
 */
router.post(
  '/',
  [
    body('first_name').notEmpty().withMessage('The first_name is required'),
    body('last_name').notEmpty().withMessage('The last_name is required'),
    body('age')
      .notEmpty()
      .withMessage('The age is required')
      .isNumeric()
      .withMessage('The age must be a number')
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() })
    }

    try {
      const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age
      })
      const savedUser = await newUser.save()
      res.status(200).send({ user: savedUser, success: true })
    } catch (err) {
      res.status(500).send({ error: err.message })
    }
  }
)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 success:
 *                   type: boolean
 *       404:
 *         description: User not found
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await User.deleteOne({ _id: id })
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'User not found', success: false })
    }
    res.status(200).send({ user: result, success: true })
  } catch {
    res.status(500).send({ error: true, success: false })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  await User.findOne({ _id: id })
    .then(response => {
      console.log(response);
      res.send({ user: response, success: true })
    })
    .catch(err => {
      res.status(404).send({ message: 'user not found', error: true })
    })
})

module.exports = router
