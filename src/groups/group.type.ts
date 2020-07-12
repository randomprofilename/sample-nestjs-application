import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "src/users/user.entity";
import { UserType } from "src/users/user.type";

@ObjectType("Group")
export class GroupType {
    @Field()
    id: number;

    @Field()
    name: string;

    @Field(type => [ UserType ])
    users: User[];
}