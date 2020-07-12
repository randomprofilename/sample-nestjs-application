import { IsNotEmpty } from "class-validator";
import { InputType, Field } from "@nestjs/graphql";

export class CreateGroupDto {
    @IsNotEmpty()
    name: string;
}

@InputType()
export class CreateGroupDtoInput extends CreateGroupDto {
    @Field()
    name:string;
}