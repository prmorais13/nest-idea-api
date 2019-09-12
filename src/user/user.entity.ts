import {
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	BeforeInsert,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';

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

	@BeforeInsert()
	async hashPassword(): Promise<void> {
		this.password = await bcrypt.hash(this.password, 10);
	}

	toResponseObject(showToken: boolean = true): UserRO {
		const { id, created, username, token } = this;
		const responseObject = { id, created, username, token };
		console.log('tem token: ' + showToken);
		if (showToken) {
			responseObject.token = token;
			console.log('tem token 2: ' + responseObject.token);
			// return responseObject;
		}
		console.log('tem token 3: ' + responseObject.token);
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
