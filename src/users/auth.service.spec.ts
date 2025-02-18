import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from '@nestjs/common';


describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;
    beforeEach(async () => {
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
        };
        const module = await Test.createTestingModule({
            providers: [AuthService, { provide: UsersService, useValue: fakeUsersService }]
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {

        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('askaj@aksjd.com', 'qweqwe');
        expect(user.password).not.toEqual('qweqwe');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();

    });

    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () =>

            Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signup('asdf@asddf.com', 'asdf')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(
            service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException);
    });
    it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () =>
            Promise.resolve([
                { email: 'asdf@asdfe.com', password: 'ad5cba6f4725802f.45167ad0a4e074bb390e9afe32f8003b0e65321ae2f95ed1130bc5f461690d4f' } as User,
            ]);
        await expect(
            service.signin('asdf@asdfe.com', 'passowrd'),
        ).rejects.toThrow(NotFoundException);
    });

    it('returns a user if correct password is provided', async () => {
        fakeUsersService.find = () =>
            Promise.resolve([
                { email: 'asdf@asdf.com', password: 'ad5cba6f4725802f.45167ad0a4e074bb390e9afe32f8003b0e65321ae2f95ed1130bc5f461690d4f' } as User,
            ]);
        const user = await service.signin('asdf@asdf.com', 'mypassword');
        expect(user).toBeDefined();
        // const user = await service.signup('asdf@asdf.com', 'mypassword');
        // console.log(user);
    });
});
