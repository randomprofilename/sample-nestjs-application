import { Resolver, Args, Mutation } from "@nestjs/graphql";
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

    @Mutation(returns => GroupType)
    addUserToGroup(
        @Args('groupId') groupId: number, 
        @Args('userId') userId: number 
    ): Promise<Group> {
        return this.groupService.addUserToGroup(groupId, userId);
    }

    @Mutation(returns => GroupType)
    deleteUserFromGroup(
        @Args('groupId') groupId: number, 
        @Args('userId') userId: number 
    ): Promise<Group> {
        return this.groupService.deleteUserFromGroup(groupId, userId);
    }
}