import { Controller, Get, Param, Body, Post, Delete, ParseIntPipe, Query, Patch } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Group } from './group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { GetGroupFilterDto } from './dto/get-group-filter.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
@Controller('groups')
export class GroupsController {
    constructor(
        private groupService: GroupsService
    ) {}

    @Get()
    getGroups(
        @Query() getGroupFilterDto: GetGroupFilterDto
    ): Promise<Group[]> {
        return this.groupService.getGroups(getGroupFilterDto);
    }

    @Get("/:id")
    getGroupById(
        @Param("id", ParseIntPipe) id: number,
        @Query() getGroupFilterDto: GetGroupFilterDto
    ): Promise<Group> {
        return this.groupService.getGroupById(id, getGroupFilterDto);
    }

    @Post("/:id/users")
    addUserToGroup(
        @Param("id", ParseIntPipe) id: number,
        @Body("userId", ParseIntPipe) userId: number
    ): Promise<Group> {
        return this.groupService.addUserToGroup(id, userId);
    }
    
    @Delete("/:id/users/:userid")
    deleteUserFromGroup(
        @Param("id", ParseIntPipe) id: number,
        @Param("userId", ParseIntPipe) userId: number
    ): Promise<Group> {
        return this.groupService.deleteUserFromGroup(id, userId);
    }

    @Post()
    createGroup(
        @Body() createGroupDto: CreateGroupDto
    ): Promise<Group> {
        return this.groupService.createGroup(createGroupDto);
    }

    @Patch("/:id")
    updateGroup(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateGroupDto: UpdateGroupDto
    ): Promise<Group> {
        return this.groupService.updateGroup(id, updateGroupDto);
    }

    @Delete("/:id")
    deleteGroup(
        @Param("id", ParseIntPipe) id: number
    ): Promise<void> {
        return this.groupService.deleteGroup(id);
    }
}
