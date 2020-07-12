import { IsNotEmpty } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;
}

@InputType()
export class CreateUserDtoInput extends CreateUserDto {
    @Field()
    username: string;
}