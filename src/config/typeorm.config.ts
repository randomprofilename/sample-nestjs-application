import { MongoConnectionName } from "src/constants";
import * as config from 'config';
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { MongoConnectionOptions } from "typeorm/driver/mongodb/MongoConnectionOptions";

const postgresConfig = config.get('db.postgres') as PostgresConnectionOptions;
const mongoConfig = config.get('db.mongo') as MongoConnectionOptions;

const postgres: PostgresConnectionOptions = {
    type: postgresConfig.type,
    host: postgresConfig.host,
    port: postgresConfig.port,
    username: postgresConfig.username,
    password: postgresConfig.password,
    database: postgresConfig.database,
    synchronize: postgresConfig.synchronize,

    entities: [
        'dist/groups/*.entity.js',
        'dist/users/*.entity.js'
    ]
};

const mongo: MongoConnectionOptions = {
    name: MongoConnectionName,
    type: mongoConfig.type,
    url: mongoConfig.url,
    synchronize: mongoConfig.synchronize,
    useUnifiedTopology: mongoConfig.useUnifiedTopology,

    entities: [ 'dist/logger/*.entity{.js,.ts}' ]
};

export const typeOrmConfig = { 
    mongo, 
    postgres 
};