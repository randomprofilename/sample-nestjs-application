import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "src/users/user.entity";

@Entity()
export class Group extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => User, user => user.groups)
    @JoinTable({
        name: "user_group"
    })
    users: User[];

    removeUser(user: User): boolean {
        if (!this.users.some(({ id }) => id === user.id)) 
            return false
        
        this.users = this.users.filter(({ id }) => id !== user.id);
        return true;
    }
}