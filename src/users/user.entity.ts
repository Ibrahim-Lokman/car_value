import { AfterRemove, AfterInsert, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log("User Inserted with id: ", this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log("User Updated with id: ", this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log("User Removed with id: ", this.id);
    }
}