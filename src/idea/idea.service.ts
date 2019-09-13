import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IdeaEntity } from './idea.entity';
import { Repository } from 'typeorm';
import { IdeaDto, IdeaRO } from './idea.dto.interface';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class IdeaService {
	constructor(
		@InjectRepository(IdeaEntity)
		private ideaRepository: Repository<IdeaEntity>,

		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
	) {}

	// async getAll(author: UserEntity) {
	// 	const query = this.ideaRepository.createQueryBuilder('idea');
	// 	query.where('authorId = :authorId', { authorId: author.id });
	// 	const ideas = await query.getMany();
	// 	// console.log(JSON.stringify(ideas));

	// 	if (ideas.length === 0) {
	// 		throw new HttpException(
	// 			`Não há tarefas para os critérios informados!`,
	// 			HttpStatus.NOT_FOUND,
	// 		);
	// 	}
	// 	try {
	// 		return ideas.map(idea => this.toResponseObject(idea));
	// 	} catch (error) {
	// 		throw new HttpException(
	// 			`Erro inesperado no servidor!`,
	// 			HttpStatus.INTERNAL_SERVER_ERROR,
	// 		);
	// 	}
	// }
	async getAll(page: number = 1): Promise<IdeaRO[]> {
		const ideas = await this.ideaRepository.find({
			relations: ['author'],
			take: 10,
			skip: 10 * (page - 1),
		});
		return ideas.map(idea => this.toResponseObject(idea));
	}

	async getById(id: number): Promise<IdeaRO> {
		const idea = await this.ideaRepository.findOne({
			where: { id },
			relations: ['author'],
		});

		if (!idea) {
			throw new HttpException(
				`Registro com ID : ${id} não encontrado!`,
				HttpStatus.NOT_FOUND,
			);
		}

		return this.toResponseObject(idea);
	}

	async create(user: UserEntity, data: IdeaDto): Promise<IdeaRO> {
		const author = await this.userRepository.findOne({
			where: { id: user.id },
		});
		const idea = this.ideaRepository.create({ ...data, author });
		await this.ideaRepository.save(idea);
		return this.toResponseObject(idea);
	}

	async update(
		id: number,
		user: UserEntity,
		data: Partial<IdeaDto>,
	): Promise<IdeaRO> {
		let idea = await this.ideaRepository.findOne({
			where: { id },
			relations: ['author'],
		});

		if (!idea) {
			throw new HttpException(
				`Registro com ID : ${id} não encontrado!`,
				HttpStatus.NOT_FOUND,
			);
		}

		this.ensureOwnership(idea, user);

		await this.ideaRepository.update({ id }, data);
		idea = await this.ideaRepository.findOne({
			where: { id },
			relations: ['author'],
		});
		return this.toResponseObject(idea);
	}

	async delete(id: number, user: UserEntity) {
		const idea = await this.ideaRepository.findOne({
			where: { id },
			relations: ['author'],
		});

		if (!idea) {
			throw new HttpException(
				`Registro com ID : ${id} não encontrado!`,
				HttpStatus.NOT_FOUND,
			);
		}
		this.ensureOwnership(idea, user);
		await this.ideaRepository.delete({ id });

		return this.toResponseObject(idea);
	}

	// Metódos privados
	private toResponseObject(idea: IdeaEntity) {
		return { ...idea, author: idea.author.toResponseObject(false) };
	}

	private ensureOwnership(idea: IdeaEntity, user: UserEntity) {
		if (idea.author.id !== user.id) {
			throw new HttpException('Usuário inválido', HttpStatus.UNAUTHORIZED);
		}
	}
}
