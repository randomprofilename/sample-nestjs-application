import { IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { StringToBoolTransform } from "src/transforms/string-to-bool.transform";

export class GetGroupFilterDto {
    @IsOptional()
    @Transform(StringToBoolTransform)
    withUsers: boolean;
}