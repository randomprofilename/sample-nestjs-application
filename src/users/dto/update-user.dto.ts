import { MinLength } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

export class UpdateUserDto {
    @MinLength(1)
    username: string;
}

@InputType()
export class UpdateUserDtoInput extends UpdateUserDto {
    @Field()
    username: string;
}