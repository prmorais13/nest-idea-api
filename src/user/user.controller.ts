import {
	Controller,
	Post,
	Get,
	Body,
	UsePipes,
	UseGuards,
	Param,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserDto, UserRO } from './user.dto';
import { ValidationPipe } from './../shared/validation.pipe';
import { AuthGuard } from './../shared/auth.guard';
import { UserEntity } from './user.entity';
import { User } from './user.decorator';

@Controller()
export class UserController {
	constructor(private userService: UserService) {}

	@Get('api/users')
	@UseGuards(AuthGuard)
	getAllUsers(@User() user: UserEntity): Promise<UserRO[]> {
		/// console.log(user);
		return this.userService.getAll();
	}

	@Get('api/users/:username')
	@UseGuards(AuthGuard)
	getByUsername(@Param('username') username: string): Promise<UserRO> {
		return this.userService.getUsername(username);
	}

	@Post('login')
	@UsePipes(ValidationPipe)
	login(@Body() data: UserDto): Promise<UserRO> {
		return this.userService.login(data);
	}

	@Post('register')
	@UsePipes(ValidationPipe)
	register(@Body() data: UserDto): Promise<UserRO> {
		return this.userService.register(data);
	}
}
