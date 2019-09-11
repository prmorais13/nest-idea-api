import { Controller, Post, Get, Body, UsePipes } from '@nestjs/common';

import { UserService } from './user.service';
import { UserDto, UserRO } from './user.dto';
import { ValidationPipe } from './../shared/validation.pipe';

@Controller()
export class UserController {
	constructor(private userService: UserService) {}

	@Get('api/users')
	getAllUsers(): Promise<UserRO[]> {
		return this.userService.getAll();
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
