import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserDto, UserRO } from './user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
	) {}

	async getAll(page: number = 1): Promise<UserRO[]> {
		const users = await this.userRepository.find({
			relations: ['ideas'],
			take: 10,
			skip: 10 * (page - 1),
		});
		return users.map(user => user.toResponseObject(false));
	}

	async getId(username: string) {
		const user = await this.userRepository.findOne({
			where: { username },
			relations: ['ideas'],
		});
		return user.toResponseObject(false);
	}

	async login(data: UserDto): Promise<UserRO> {
		const { username, password } = data;
		const user = await this.userRepository.findOne({ where: { username } });
		if (!user || !(await user.comparePassword(password))) {
			throw new HttpException(
				'Usuário e/ou Senha Inválido!',
				HttpStatus.BAD_REQUEST,
			);
		}
		return user.toResponseObject(true);
	}

	async register(data: UserDto): Promise<UserRO> {
		const { username } = data;
		let user = await this.userRepository.findOne({ where: { username } });
		if (user) {
			throw new HttpException('Usuário já existente!', HttpStatus.BAD_REQUEST);
		}

		user = this.userRepository.create(data);
		await this.userRepository.save(user);
		return user.toResponseObject(true);
	}
}
