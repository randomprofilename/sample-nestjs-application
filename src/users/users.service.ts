import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';
import { LoggerService } from 'src/logger/logger.service';
import { UsersModuleName } from 'src/constants';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private loggerService: LoggerService
    ) {}

    private _getRelationsParameter = ({ withGroups, withFriends }: GetUserFilterDto): string[] => [ 
        withGroups ? "groups" : null,
        withFriends ? "friends" : null 
    ].filter(relation => relation != null);

    getUsers(getUserDto: GetUserFilterDto): Promise<User[]> {
        try {
            return this.userRepository.find({ 
                relations: this._getRelationsParameter(getUserDto)
            });
            
        } catch (error) {
            this.loggerService.error({ 
                module: UsersModuleName,
                component: `${this.constructor.name}.getUsers`,
                message: error.message || `Cannot get users with: ${JSON.stringify(getUserDto)}`,
                stack: error.stack
            });
            
            throw error;
        }
    }

    async getUserById(id: number, getUserDto: GetUserFilterDto = {}): Promise<User> {
        try {
            const user = await this.userRepository.findOne(id, { 
                relations: this._getRelationsParameter(getUserDto)
            });
    
            if (user == null)
                throw new NotFoundException();
    
            return user;
            
        } catch (error) {
            this.loggerService.error({ 
                module: UsersModuleName,
                component: `${this.constructor.name}.getUserById`,
                message: error.message || `Cannot get user with id: ${id}`,
                stack: error.stack
            });
            
            throw error;
        }
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { username } = createUserDto;
        const user = new User();
        user.username = username;
        try {
            return this.userRepository.save(user);
        } catch (error) {
            this.loggerService.error({ 
                module: UsersModuleName,
                component: `${this.constructor.name}.createUser`,
                message: error.message || `Cannot createUser with: ${JSON.stringify(createUserDto)}`,
                stack: error.stack
            });
            
            throw error;
        }
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const { username } = updateUserDto;
        try {
            const { affected } = await this.userRepository.update(id, { username });
            if (affected < 1)
                throw new NotFoundException();

            return this.userRepository.findOne(id);
        } catch (error) {
            this.loggerService.error({ 
                module: UsersModuleName,
                component: `${this.constructor.name}.updateUser`,
                message: error.message || `Cannot updateUser with: ${JSON.stringify(updateUserDto)}`,
                stack: error.stack
            });
            
            throw error;
        }
    }

    async deleteUser(id: number): Promise<void> {
        try {
            const { affected } = await this.userRepository.delete(id);
            if (affected < 1)
                throw new NotFoundException();
            
        } catch (error) {
            this.loggerService.error({ 
                module: UsersModuleName,
                component: `${this.constructor.name}.deleteUser`,
                message: error.message || `Cannot delete user with id ${JSON.stringify(id)}`,
                stack: error.stack
            });
            
            throw error;
        }
    }

    async addFriend(id: number, friendId: number): Promise<void> {
        try {
            if (id === friendId)
                throw new ConflictException(`Both ids are equal`);

            const [ user, newFriend ] = await Promise.all([
                this.getUserById(id, { withFriends: true }), 
                this.getUserById(friendId, { withFriends: true })]
            );
    
            if (user.isFriendTo(newFriend) && newFriend.isFriendTo(user))
                throw new ConflictException(`${friendId} is already friend to ${id}`);
    
            user.friends.push(newFriend);
            newFriend.friends.push(user);
            
            await this.userRepository.save([ user, newFriend ]);
        } catch (error) {
            this.loggerService.error({ 
                module: UsersModuleName,
                component: `${this.constructor.name}.addFriend`,
                message: error.message || `Cannot add friend ${friendId} to ${id}`,
                stack: error.stack
            });
            
            throw error;
        }
    }

    async removeFriend(id: number, friendId: number): Promise<void> {
        try {
            if (id === friendId)
                throw new ConflictException(`Both ids are equal`);
            
            const [ user, friend ] = await Promise.all([
                this.getUserById(id), 
                this.getUserById(friendId)]
            );
            
            if (user.isFriendTo(friend) || friend.isFriendTo(user)) {
                user.removeFriend(friend);
                friend.removeFriend(user);
            } else
                throw new NotFoundException();
    
            await this.userRepository.save([ user, friend ]);            
        } catch (error) {
            this.loggerService.error({ 
                module: UsersModuleName,
                component: `${this.constructor.name}.addFriend`,
                message: error.message || `Cannot remove friend ${friendId} from ${id}`,
                stack: error.stack
            });
            
            throw error;
        }
    }
}
