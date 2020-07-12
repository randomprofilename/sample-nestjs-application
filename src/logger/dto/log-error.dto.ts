import { LogVerboseDto } from "./log-verbose.dto"

export class LogErrorDto extends LogVerboseDto {
    stack: string;
}