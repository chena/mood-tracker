module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'A hard to guess string',
  MONGO_URI: process.env.MONGO_URI || 'localhost',
  HS_SECRET: process.env.HS_SECRET || 'cd78b15d968c43c0d4023e98a7b7fe254a924951b7e8a6dbccfeb38576250e55'
}