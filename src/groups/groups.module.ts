import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { GroupsService } from './groups.service';
import { UsersModule } from 'src/users/users.module';
import { LoggerModule } from 'src/logger/logger.module';
import { GroupResolver } from './group.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Group ]),
    UsersModule,
    LoggerModule
  ],
  controllers: [GroupsController],
  providers: [
    GroupsService,
    GroupResolver
  ]
})
export class GroupsModule {}
