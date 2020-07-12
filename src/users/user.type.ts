import { ObjectType, Field } from "@nestjs/graphql";
import { GroupType } from "src/groups/group.type";
import { User } from "./user.entity";

@ObjectType("User")
export class UserType {
    @Field()
    id: number;

    @Field()
    username: string;

    @Field(type => [ GroupType ])
    groups: string;

    @Field(type => [ UserType ])
    friends: User[];
}