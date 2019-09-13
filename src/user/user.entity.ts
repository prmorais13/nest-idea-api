import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	BeforeInsert,
	OneToMany,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';
import { IdeaEntity } from '../idea/idea.entity';

@Entity('user')
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created: Date;

	@Column({ unique: true })
	username: string;

	@Column('text')
	password: string;

	@OneToMany(type => IdeaEntity, ideas => ideas.author)
	ideas: IdeaEntity[];

	@BeforeInsert()
	async hashPassword(): Promise<void> {
		this.password = await bcrypt.hash(this.password, 10);
	}

	toResponseObject(showToken: boolean = true): UserRO {
		const { id, created, username, token } = this;
		const responseObject: UserRO = { id, created, username };

		if (showToken) {
			responseObject.token = token;
		}

		if (this.ideas) {
			responseObject.ideas = this.ideas;
		}
		return responseObject;
	}

	async comparePassword(pwd: string): Promise<boolean> {
		return await bcrypt.compare(pwd, this.password);
	}

	private get token(): string {
		const { id, username } = this;
		return jwt.sign({ id, username }, process.env.SECRET, { expiresIn: '7d' });
	}
}
