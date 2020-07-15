import { MinLength } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

export class UpdateGroupDto {
    @MinLength(1)
    name: string;
}

@InputType()
export class UpdateGroupDtoInput extends UpdateGroupDto {
    @Field()
    name: string;
}