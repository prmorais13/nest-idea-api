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

	@Query()
	user(@Args() username: string) {
		return this.userService.getId(username);
	}

	@Query()
	whoami() {
		return;
	}

	@Mutation()
	login(@Args() user: UserDto) {
		return this.userService.login(user);
	}

	@Mutation()
	register(@Args() user: UserDto) {
		return this.userService.register(user);
	}
}
