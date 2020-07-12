import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { UsersService } from 'src/users/users.service';
import { GetGroupFilterDto } from './dto/get-group-filter.dto';
import { LoggerService } from 'src/logger/logger.service';
import { GroupsModuleName } from 'src/constants';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
        private usersService: UsersService,
        private loggerService: LoggerService,
    ) {}

    private _getRelationsParameter = ({ withUsers }: GetGroupFilterDto): string[] => [ 
        withUsers ? "users" : null
    ].filter(relation => relation != null);

    async getGroups(getGroupFilterDto: GetGroupFilterDto): Promise<Group[]> {
        try {
            const groups = await this.groupRepository.find({ 
                relations: this._getRelationsParameter(getGroupFilterDto),
                where: {"asdas": "asdas"}
            });
            return groups;
        } catch (error) {
            this.loggerService.error({ 
                module: GroupsModuleName,
                component: `${this.constructor.name}.getGroups`,
                message: error.message || `Cannot get groups with data: ${JSON.stringify(getGroupFilterDto)}`,
                stack: error.stack
            });
            throw error instanceof NotFoundException ? 
                error : 
                new InternalServerErrorException();
        }
    }

    async getGroupById(id: number, getGroupFilterDto?: GetGroupFilterDto): Promise<Group> {
        try {
            const group = await this.groupRepository.findOne({ id }, {
                relations: this._getRelationsParameter(getGroupFilterDto)
            });
            if (group == null)
                throw new NotFoundException();
            return group;
        } catch (error) {
            this.loggerService.error({ 
                module: GroupsModuleName,
                component: `${this.constructor.name}.getGroupById`,
                message: error.message || `Cannot get group with ${id} and data: ${JSON.stringify(getGroupFilterDto)}`,
                stack: error.stack
            });
            throw error instanceof NotFoundException ? 
                error : 
                new InternalServerErrorException();
        }
    }

    async addUserToGroup(id: number, userId: number): Promise<Group> {
        try {
            const [ group, user ] = await Promise.all([
                this.getGroupById(id), 
                this.usersService.getUserById(userId)
            ]);
            
            if (group.users != null)
                group.users.push(user);
            else
                group.users = [ user ];

            return this.groupRepository.save(group);
        } catch (error) {
            this.loggerService.error({ 
                module: GroupsModuleName,
                component: `${this.constructor.name}.addUserToGroup`,
                message: error.message || `Cannot add user ${userId} to group ${id}`,
                stack: error.stack
            });
            throw error instanceof NotFoundException ? 
                error : 
                new InternalServerErrorException();
        }
    }

    async deleteUserFromGroup(id: number, userId: number): Promise<Group> {
        try {
            const [ group, user ] = await Promise.all([ 
                this.getGroupById(id),
                this.usersService.getUserById(userId)]
            );
            
            if (!group.removeUser(user))
                throw new NotFoundException(`User ${user.username} doesn't attached to group`);

            return this.groupRepository.save(group);
        } catch (error) {
            this.loggerService.error({ 
                module: GroupsModuleName,
                component: `${this.constructor.name}.deleteUserFromGroup`,
                message: error.message || `Cannot remove user ${userId} from group ${id}`,
                stack: error.stack
            });
            
            throw error instanceof NotFoundException ? 
                error : 
                new InternalServerErrorException();
        }
    }

    async createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
        const { name } = createGroupDto;
        const group = new Group();
        group.name = name;
        group.users = [];

        try {
            return this.groupRepository.save(group);
        } catch (error) {
            this.loggerService.error({ 
                module: GroupsModuleName,
                component: `${this.constructor.name}.createGroup`,
                message: error.message || `Cannot create group with: ${JSON.stringify(createGroupDto)}`,
                stack: error.stack
            });
            
            throw error instanceof NotFoundException ? 
                error : 
                new InternalServerErrorException();
        }
    }

    async deleteGroup(id: number): Promise<void> {
        try {
            const result = await this.groupRepository.delete(id);
            if (result.affected < 1)
                throw new NotFoundException();
            
        } catch (error) {
            this.loggerService.error({ 
                module: GroupsModuleName,
                component: `${this.constructor.name}.deleteGroup`,
                message: error.message || `Cannot delete group with id ${id}`,
                stack: error.stack
            });
            
            throw error instanceof NotFoundException ? 
                error : 
                new InternalServerErrorException();
        }
    }
}
