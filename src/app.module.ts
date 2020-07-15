import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from './groups/groups.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';
import { GraphQLModule } from '@nestjs/graphql';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    GroupsModule, 
    UsersModule,
    TypeOrmModule.forRoot(typeOrmConfig.postgres),
    TypeOrmModule.forRoot(typeOrmConfig.mongo),
    LoggerModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true
    })
  ],
    
  controllers: [],
})
export class AppModule {}
