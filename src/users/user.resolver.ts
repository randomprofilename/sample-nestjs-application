import { Resolver, Query, Args, Mutation, Int } from "@nestjs/graphql";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { UserType } from "./user.type";
import { CreateUserDtoInput } from "./dto/create-user.dto";
import { UpdateUserDtoInput } from "./dto/update-user.dto";

@Resolver(of => User)
export class UserResolver {
    constructor(
        private usersService: UsersService
    ){}

    @Query(returns => [ UserType ])
    users(): Promise<User[]> {
        return this.usersService.getUsers({ withFriends: true, withGroups: true });
    }

    @Query(returns => UserType)
    user(
        @Args("id") id: number
    ): Promise<User> {
        return this.usersService.getUserById(id, { withFriends: true, withGroups: true });
    }

    @Mutation(returns => UserType)
    createUser(
        @Args('createUserDto') createUserDto: CreateUserDtoInput
    ): Promise<User> {
        return this.usersService.createUser(createUserDto);
    }

    @Mutation(returns => UserType)
    updateUser(
        @Args("id") id: number,
        @Args('updateUserDto') updateUserDto: UpdateUserDtoInput
    ): Promise<User> {
        return this.usersService.updateUser(id, updateUserDto);
    }

    @Mutation(returns => Int)
    async deleteUser(
        @Args('id') id: number
    ): Promise<number> {
        await this.usersService.deleteUser(id);
        return id;
    }

    @Mutation(returns => Int)
    async addFriend(
        @Args('userId') userId: number,
        @Args('friendId') friendId: number
    ): Promise<number> {
        await this.usersService.addFriend(userId, friendId);
        return userId;
    }

    @Mutation(returns => Int)
    async removeFriend(
        @Args('userId') userId: number,
        @Args('friendId') friendId: number
    ): Promise<number> {
        await this.usersService.removeFriend(userId, friendId);
        return userId;
    }
}   