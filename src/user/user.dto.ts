import { IsNotEmpty } from 'class-validator';
import { IdeaEntity } from '../idea/idea.entity';

export class UserDto {
	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	password: string;
}

export class UserRO {
	id: number;
	username: string;
	created: Date;
	ideas?: IdeaEntity[];
	token?: string;
}
