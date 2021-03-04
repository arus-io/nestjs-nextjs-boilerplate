import * as dotenv from 'dotenv';
import path from 'path';

// for local dev
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
// for local build
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const settings = require('./index');
checkSettings(settings, '');

export default settings;

function checkSettings(obj: any, key: string): any {
  if (obj !== undefined) {
    if (typeof obj === 'string' || typeof obj === 'boolean') return;

    const keys = Object.keys(obj);
    if (keys.length > 0) Object.keys(obj).forEach((k) => checkSettings(obj[k], k));

    return;
  }
  throw new Error(`Missing ENV property ${key}`);
}
