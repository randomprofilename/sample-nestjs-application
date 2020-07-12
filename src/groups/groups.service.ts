import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UsersService } from 'src/users/users.service';
import { GetGroupFilterDto } from './dto/get-group-filter.dto';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
        private usersService: UsersService
    ) {}

    private _getRelationsParameter = ({ withUsers }: GetGroupFilterDto): string[] => [ 
        withUsers ? "users" : null
    ].filter(relation => relation != null);

    getGroups(getGroupFilterDto: GetGroupFilterDto): Promise<Group[]> {
        return this.groupRepository.find({ 
            relations: this._getRelationsParameter(getGroupFilterDto)
        });
    }

    async getGroupById(id: number, getGroupFilterDto?: GetGroupFilterDto): Promise<Group> {
        const group = await this.groupRepository.findOne({ id }, {
            relations: this._getRelationsParameter(getGroupFilterDto)
        });
        if (group == null)
            throw new NotFoundException();
        return group;
    }

    async addUserToGroup(id: number, userId: number): Promise<Group> {
        const group = await this.getGroupById(id);
        const user = await this.usersService.getUserById(userId);
        
        if (group.users != null)
            group.users.push(user);
        else
            group.users = [ user ];
        return this.groupRepository.save(group);
    }

    async deleteUserFromGroup(id: number, userId: number): Promise<Group> {
        const [ group, user ] = await Promise.all([ 
            this.getGroupById(id),
            this.usersService.getUserById(userId)]
        );
        
        if (!group.removeUser(user))
            throw new NotFoundException(`User ${user.username} doesn't attached to group`);
        
        return this.groupRepository.save(group);
    }

    async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
        const { name } = createGroupDto;
        const group = new Group();
        group.name = name;
        group.users = [];
        await this.groupRepository.save(group);
        
        return group;
    }

    async deleteGroup(id: number): Promise<void> {
        const result = await this.groupRepository.delete(id);
        if (result.affected < 1)
            throw new NotFoundException();
    }
}
