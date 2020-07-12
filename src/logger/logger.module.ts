import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogMessage } from './log-message.entity';
import { MongoConnectionName } from 'src/constants';
import { LoggerController } from './logger.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ 
      LogMessage
    ], MongoConnectionName)
  ],
  providers: [LoggerService],
  exports: [LoggerService],
  controllers: [LoggerController]
})
export class LoggerModule {}
