import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, ManyToMany, JoinTable, JoinColumn } from "typeorm";
import { Group } from "src/groups/group.entity";
import { group } from "console";
import { userInfo } from "os";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @ManyToMany(type => Group, group => group.users)
    groups: string[];

    @ManyToMany(type => User, user => user.friends)
    @JoinTable({ name: "friends" })
    friends: User[];

    isFriendTo(user: User): boolean {
        return user.friends.some(friend => friend.id === this.id);
    }

    removeFriend(user: User): boolean {
        if (!this.friends.some(friend => friend.id === user.id)) 
            return false
        
        this.friends = this.friends.filter(f => f.id !== user.id);
        return true;
    }
}