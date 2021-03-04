import dotenv from 'dotenv';
import path from 'path';

// require('./infrastructure/config/_loadEnvironment');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const conf = require('./modules/infra/config/ormconfig');

console.log(conf);
// export default conf;
module.exports = conf.default;
