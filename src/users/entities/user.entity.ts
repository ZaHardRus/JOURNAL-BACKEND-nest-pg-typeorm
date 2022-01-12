import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    fullName:string

    @Column()
    email:string

    @Column()
    password:string
}
