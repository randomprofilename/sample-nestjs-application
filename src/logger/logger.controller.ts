import { Controller, Get, Query, Param } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { GetLogsFilterDto } from './dto/get-logs-filter.dto';
import { LogMessage } from './log-message.entity';

@Controller('logger')
export class LoggerController {
    constructor(
        private loggerService: LoggerService
    ) {}

    @Get()
    async getLogMessages(
        @Query() getLogsFilterDto: GetLogsFilterDto
    ): Promise<{ data: LogMessage[], total: number }> {
        const [ data, total ] = await this.loggerService.getLogs(getLogsFilterDto);
        return {
            data,
            total
        };
    }

    @Get("/:id")
    async getLogById(
        @Param("id") id: string
    ): Promise<LogMessage> {
        return this.loggerService.getLogById(id);
    }
}
