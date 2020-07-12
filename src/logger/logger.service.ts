import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { LogMessage } from './log-message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LogVerboseDto } from './dto/log-verbose.dto';
import { LogLevel } from './log-level.enum';
import { LogErrorDto } from './dto/log-error.dto';
import { GetLogsFilterDto } from './dto/get-logs-filter.dto';
import { MongoConnectionName } from 'src/constants';

@Injectable()
export class LoggerService {
    constructor(
        @InjectRepository(LogMessage, MongoConnectionName)
        private logMessageRepository: Repository<LogMessage>
    ) {}
    private writeInConsole = true;
    
    private logger = new Logger();
    
    async getLogs(getLogsFilterDto: GetLogsFilterDto): Promise<[ LogMessage[], number ]> {
        const { size, page, logLevel } = getLogsFilterDto;
        const [ logMessages, count ] = await this.logMessageRepository.findAndCount({
            where: logLevel ? { level: logLevel } : undefined,
            take: size,
            skip: (page - 1) * size
        });

        return [ logMessages, count ];
    }

    async getLogById(id: string): Promise<LogMessage> {
        const logMessage = await this.logMessageRepository.findOne({ id });
        if (logMessage == null)
            throw new NotFoundException();

        return logMessage;
    }

    async verbose(logVerboseDto: LogVerboseDto): Promise<void> {
        const { module, message, component } = logVerboseDto;
        const logMessage = this.logMessageRepository.create({
            id: uuid(),
            module,
            message, 
            component,
            level: LogLevel.VERBOSE
        });

        if (this.writeInConsole)
            this.logger.verbose(`${module}.${component}: ${message}`);
        await this.logMessageRepository.save(logMessage);
    }

    async error(logVerboseDto: LogErrorDto): Promise<void> {
        const { module, message, component, stack } = logVerboseDto;
        const logMessage = this.logMessageRepository.create({
            id: uuid(),
            module, 
            message, 
            component, 
            stack,
            level: LogLevel.ERROR
        });
        
        if (this.writeInConsole)
            this.logger.error(`${module}.${component}: ${message}`);
        
        await this.logMessageRepository.save(logMessage);
    }
}
