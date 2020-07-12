import { Entity, ObjectIdColumn, PrimaryColumn, Column, BaseEntity, CreateDateColumn } from "typeorm";
import { LogLevel } from "./log-level.enum";


@Entity()
export class LogMessage extends BaseEntity {
    @ObjectIdColumn()
    _id: string;

    @PrimaryColumn()
    id: string;

    @Column()
    level: LogLevel;

    @Column()
    module: string;

    @Column()
    component: string;

    @Column()
    message: string;

    @Column()
    stack: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;
}