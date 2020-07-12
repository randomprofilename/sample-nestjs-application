import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsModule } from './groups/groups.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GroupsModule, 
    UsersModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "mysecretpassword",
      entities: [
        'dist/**/*.entity.js'
      ],
      database: "usergroupmanagement",
      synchronize: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
