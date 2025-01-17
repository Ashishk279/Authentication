const User = require("../models/User")
const jwt = require('jsonwebtoken')
// handle Errors
const handleErrors = (err) => {
  console.log(err.message, err.code)
  let errors = { email: '', password: '' };
  // incorrect email
  if(err.message === "Incorrect email"){
    errors.email = 'That email is not registered';
    return errors
  }

  // incorrect password
  if(err.message === "Incorrect password"){
    errors.email = 'That password is incorrect';
    return errors
  }
  //duplicate error code
  if (err.code === 11000) {
    errors.email = "That email is already registered"
    return errors;
  }
  
  // validattion errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
      // console.log(properties)
    })

    return errors;
  }
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret jwt', {
    expiresIn: maxAge
  })
}

module.exports.signup_get = async (req, res) => {
  res.send('signup')
}
module.exports.login_get = async (req, res) => {
  res.send('login')
}
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors: errors })
  }
}
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    console.log(user)
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
    res.status(200).json({ user: user._id })
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({errors: errors})
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  // res.redirect('/')
  res.send('Now you need to login again for redirect a page.');
}