import { IsString } from 'class-validator';
import { UserRO } from '../user/user.dto';

export class IdeaDto {
	@IsString()
	idea: string;

	@IsString()
	description: string;
}

export class IdeaRO {
	id?: number;
	created: Date;
	updated: Date;
	idea: string;
	description: string;
	author: UserRO;
}
