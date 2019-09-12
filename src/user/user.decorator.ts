import { ReflectMetadata, createParamDecorator } from '@nestjs/common';

import { UserEntity } from './user.entity';

export const User = createParamDecorator(
	(data, req): UserEntity => {
		return data ? req.user[data] : req.user;
	},
);
