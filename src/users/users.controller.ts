import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';


@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
    constructor(private userService: UsersService, private authService: AuthService) { }

    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any) {
    //     session.color = color;
    // }

    // @Get('/colors')
    // getColor(@Session() session: any) {
    //     return session.color;
    // }

    // @Get('/whoami_v1')
    // whoAmI(@Session() session: any) {
    //     return this.userService.findOne(session.userId);
    // }

    @Get('/whoami')
    whoAmI(@CurrentUser() user: User) {
        console.log(user);
        return user;
    }


    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const { email, password } = body;
        console.log(email, password);
        console.log("**************");
        const user = await this.authService.signup(email, password);
        session.userId = user.id;
        return user;

    }

    @Post('/signout')
    signout(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const { email, password } = body;
        const user = await this.authService.signin(email, password);
        session.userId = user.id;
        return user;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('Handler is running');
        const user = await this.userService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('User not found');
        } else {
            return user;
        }
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body);
    }

}
