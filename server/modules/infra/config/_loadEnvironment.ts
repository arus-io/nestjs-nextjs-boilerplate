import * as dotenv from 'dotenv';
import path from 'path';

// for local dev
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
// for local build
dotenv.config({ path: path.resolve(__dirname, '../.env') });

