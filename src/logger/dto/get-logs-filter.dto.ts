import { IsOptional, IsIn, Min, IsDate, IsNumber } from "class-validator";
import { LogLevel } from "../log-level.enum";
import { Transform } from "class-transformer";

export class GetLogsFilterDto {
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @IsOptional()
    @Transform(value => parseInt(value))
    @Min(1)
    page: number = 1;
    
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @IsOptional()
    @Transform(value => parseInt(value))
    @Min(1)
    size: number = 20;

    @IsOptional()
    @IsIn([LogLevel.ERROR, LogLevel.VERBOSE])
    logLevel: LogLevel;

    @IsOptional()
    @IsDate()
    createdAfter: Date;
}