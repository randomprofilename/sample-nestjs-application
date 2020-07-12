import { Resolver, Args, Mutation, Int, ID } from "@nestjs/graphql";
import { GroupType } from "./group.type";
import { GroupsService } from "./groups.service";
import { Query } from "@nestjs/graphql";
import { Group } from "./group.entity";
import { ParseIntPipe } from "@nestjs/common";
import { CreateGroupDtoInput } from "./dto/create-group.dto";

@Resolver(of => GroupType)
export class GroupResolver {
    constructor(
        private groupService: GroupsService
    ) {}

    @Query(returns => GroupType)
    group(
        @Args("id", ParseIntPipe) id: number
    ): Promise<Group> {
        return this.groupService.getGroupById(id);
    }

    @Query(returns => [GroupType])
    groups(): Promise<Group[]> {
        return this.groupService.getGroups({ withUsers: true });
    }

    @Mutation(returns => GroupType)
    createGroup(
        @Args('createGroupInput') createGroupDtoInput: CreateGroupDtoInput
    ): Promise<Group> {
        return this.groupService.createGroup(createGroupDtoInput);
    }

    @Mutation(returns => Int)
    async deleteGroup(
        @Args('id') id: number
    ): Promise<number> {
        await this.groupService.deleteGroup(id);
        return id
    }

    @Mutation(returns => Int)
    async addUserToGroup(
        @Args('groupId') groupId: number, 
        @Args('userId') userId: number 
    ): Promise<number> {
        await this.groupService.addUserToGroup(groupId, userId);
        return 1;
    }

    @Mutation(returns => Int)
    async deleteUserFromGroup(
        @Args('groupId') groupId: number, 
        @Args('userId') userId: number 
    ): Promise<number> {
        await this.groupService.deleteUserFromGroup(groupId, userId);
        return 1;
    }
}