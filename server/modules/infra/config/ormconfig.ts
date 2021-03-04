import path from 'path';
import { DefaultNamingStrategy, NamingStrategyInterface, Table } from 'typeorm';

import config from './index';

const entities = path.resolve(__dirname, '../../');
const migrations = path.resolve(__dirname, '../../../db/migrations');
const root = path.resolve(__dirname, '../../../');
const db = config().DATABASE_URL;

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ): string {
    tableOrName = typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    const name = columnNames.reduce((name, column) => `${name}_${column}`, `${tableOrName}`); //_${referencedTablePath}

    return `${name}_fkey`;
  }
}

export default {
  type: 'postgres',
  url: db,
  autoLoadEntities: true,
  namingStrategy: new CustomNamingStrategy(),
  entities: [`${entities}/**/*.entity.{ts,js}`],
  migrations: [`${migrations}/**/*.{ts,js}`],
  // migrationsTableName: "migrations",
  cli: {
    migrationsDir: migrations,
    entitiesDir: path.relative(root, entities),
  },

  logging: false, // @TODO - make it configurable
  synchronize: false,
};
