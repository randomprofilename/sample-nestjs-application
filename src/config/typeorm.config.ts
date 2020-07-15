import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { MongoConnectionName } from "src/constants";
import * as config from 'config';

const postgresConfig = config.get('db.postgres');
const mongoConfig = config.get('db.mongo');

const postgres: TypeOrmModuleOptions = {
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

const mongo: TypeOrmModuleOptions = {
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