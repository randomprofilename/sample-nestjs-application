import { IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { StringToBoolTransform } from "src/transforms/string-to-bool.transform";

export class GetUserFilterDto {
    @IsOptional()
    @Transform(StringToBoolTransform)
    withFriends: boolean;

    @IsOptional()
    @Transform(StringToBoolTransform)
    withGroups: boolean;
}