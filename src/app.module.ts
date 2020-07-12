import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from './groups/groups.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';
import { MongoConnectionName } from './constants';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GroupsModule, 
    UsersModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "mysecretpassword",
      entities: [
        'dist/groups/*.entity.js',
        'dist/users/*.entity.js'
      ],
      database: "usergroupmanagement",
      synchronize: true
    }),
    TypeOrmModule.forRoot({
      name: MongoConnectionName,
      type: "mongodb",
      url: "mongodb://localhost/logger",
      synchronize: true,
      useUnifiedTopology: true,
      entities: [  
        'dist/logger/*.entity{.js,.ts}'
      ]
    }),
    LoggerModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true
    })
  ],
    
  controllers: [],
})
export class AppModule {}
