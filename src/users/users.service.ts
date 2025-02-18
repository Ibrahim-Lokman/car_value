import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { };

    create(email: string, password: string) {
        const user = this.usersRepository.create({ email, password });
        return this.usersRepository.save(user);
    }
    findOne(id: number) {
        if (!id) {
            return null;
        }
        return this.usersRepository.findOneBy({ id });
    }
    find(email: string) {
        return this.usersRepository.find({ where: { email } });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('User not found');
        } else {
            Object.assign(user, attrs);
            return this.usersRepository.save(user);
        }
    }

    async remove(id: number) {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('User not found');
        } else {
            return this.usersRepository.remove(user);
        }
    }
}
