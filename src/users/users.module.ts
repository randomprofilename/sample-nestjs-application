import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User ]),
    LoggerModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserResolver,
  ],
  exports: [UsersService]
})
export class UsersModule {}
