import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    private _getRelationsParameter = ({ withGroups, withFriends }: GetUserFilterDto) => [ 
        withGroups ? "groups" : null,
        withFriends ? "friends" : null 
    ].filter(relation => relation != null);

    getUsers(getUserDto: GetUserFilterDto): Promise<User[]> {
        return this.userRepository.find({ 
            relations: this._getRelationsParameter(getUserDto)
        });
    }

    async getUserById(id: number, getUserDto?: GetUserFilterDto): Promise<User> {
        const user = await this.userRepository.findOne(id, { 
            relations: this._getRelationsParameter(getUserDto)
        });

        if (user == null)
            throw new NotFoundException();

        return user;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { username } = createUserDto;

        const user = new User();
        user.username = username;
        await this.userRepository.save(user);

        return user;
    }

    async deleteUser(id: number): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected < 1)
            throw new NotFoundException();
    }

    async addFriend(id: number, friendId: number): Promise<void> {
        const [ user, newFriend ] = await Promise.all([
            this.getUserById(id), 
            this.getUserById(friendId)]
        );

        if (user.isFriendTo(newFriend) && newFriend.isFriendTo(user))
            throw new ConflictException(`${friendId} is already friend to ${id}`);

        user.friends.push(newFriend);
        newFriend.friends.push(user);
        
        await this.userRepository.save([ user, newFriend ]);
    }

    async removeFriend(id: number, friendId: number): Promise<void> {
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
    }
}
