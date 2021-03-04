const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

process.env.NODE_ENV = 'test';

module.exports = async () => {
  console.log('\n======================== Jest Global Setup ======================');
  // load all envs
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });

  const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../../.env.test')));
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
};
