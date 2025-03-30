// server/config/config.js
require('dotenv').config(); 

module.exports = {
  db: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development'
};