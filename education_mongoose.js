const express = require('express')
const mongoose = require('mongoose')

mongoose
  .connect('mongodb://localhost:27017/testdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err))

// const userSchema = new mongoose.Schema({
//   name: String,
//   age: { type: Number, required: true }
// })

const userSchema = new mongoose.Schema({
  first_name: { type: String, lowercase: true, trim: true }, // lowercase converts string to lower string , trim deletes all space head and tail string , for example "   ami n   " > "ami n"
  salary: {
    type: Number,
    set: e => {
      Math.round(e)
    }
  },
  last_name: {
    type: String,
    required: function () {
      return this.admin
    },
    minlength: 3,
    maxlength: 20
  },
  favorites: { type: [String], enum: ['sport', 'programming', 'health'] },
  age: { type: Number, min: 8, max: 120 },
  date: { type: Date, default: Date.now },
  admin: { type: Boolean, default: false }
})

const User = mongoose.model('User', userSchema)

async function addUser () {
  const user = new User({ name: 'somaye' })

  await user
    .save()
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err.errors.age.properties.message)
    })
}
// addUser()

const getAllUsers = async () => {
  const users = await User.find()

  console.log(users)
}
getAllUsers()

const getUsers = async () => {
  // const filteredUser = await User.find({age: {$gt:17 , $lt:41}}) // for filter users by object for example {first_name:"mohammad" , ...}
  const filteredUser = await User.find({ name: /m/ })
    .limit(4)
    .sort({ name: 1 })
    .select({ age: 1 })
  console.log('users', filteredUser)

  // eq - nq - gt - gte - lt - lte - in - nin

  // {age : {$gte : 20 , lte: 30}}
  // {age : {$in : [20 , 25 , 30]}} // It gets all users with age equal 20 or 25 or 30
}
// getUsers()

const pagination = async () => {
  const pageNumber = 1
  const pageSize = 9

  const users = User.find()
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
}

const update = async id => {
  // const user = User.findById(id) // const user = User.find({id : ${id}}) It returns array // const user = User.findOne({ _id: id }) It returns one Item
  const user = await User.findOne({ _id: id })
  if (!user) return

  // -----------------------------
  // user.name = 'mamad'
  // user.age = 10
  user.set({
    name: 'xxx',
    age: 999
  })
  // -----------------------------
  user.deleteOne
  await user.save()
}

const removeUser = async id => {
  await User.deleteOne({ _id: id })
}

// update('6899aadfc5b4eeb1d92f3f6f')
