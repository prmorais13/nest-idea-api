import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Resolver('User')
export class UserResolver {
	constructor(private userService: UserService) {}

	@Query()
	users(@Args('page') page: number) {
		return this.userService.getAll(page);
	}

	@Mutation()
	login(@Args() username: string, password: string) {
		const user: UserDto = { username, password };
		return this.userService.login(user);
	}

	@Mutation()
	register(@Args() { username, password }) {
		const user: UserDto = { username, password };
		return this.userService.register(user);
	}
}
