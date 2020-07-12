import { Controller, Get, Param, Post, Body, Delete, ParseIntPipe, Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserFilterDto } from './dto/get-user-filter.dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ){}

    @Get()
    getUsers(@Query() getUserDto: GetUserFilterDto): Promise<User[]> {
        return this.usersService.getUsers(getUserDto);
    }

    @Get("/:id")
    getUserById(
        @Param("id", ParseIntPipe) id: number,
        @Query() getUserDto: GetUserFilterDto
    ): Promise<User> {
        return this.usersService.getUserById(id, getUserDto);
    }

    @Post()
    createUser(
        @Body() createUserDto: CreateUserDto
    ): Promise<User> {
        return this.usersService.createUser(createUserDto);
    }

    @Delete("/:id")
    deleteUser(
        @Param("id") id: number
    ): Promise<void> {
        return this.usersService.deleteUser(id);
    }

    @Post("/:id/friends")
    addFriend(
        @Param("id", ParseIntPipe) id: number,
        @Body("friendId", ParseIntPipe) friendId: number
    ): Promise<void> {
        return this.usersService.addFriend(id, friendId);
    }

    @Delete("/:id/friends/:friendId")
    removeFriend(
        @Param("id", ParseIntPipe) id: number,
        @Param("friendId", ParseIntPipe) friendId: number
    ): Promise<void> {
        return this.usersService.removeFriend(id, friendId);
    }

}
