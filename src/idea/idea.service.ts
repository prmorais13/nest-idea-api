import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IdeaEntity } from './idea.entity';
import { Repository } from 'typeorm';
import { IdeaDto } from './idea.dto.interface';

@Injectable()
export class IdeaService {
	constructor(
		@InjectRepository(IdeaEntity)
		private ideaRepository: Repository<IdeaEntity>,
	) {}

	async getAll() {
		return await this.ideaRepository.find();
	}

	async create(data: IdeaDto) {
		const idea = await this.ideaRepository.create(data);
		await this.ideaRepository.save(idea);
		return idea;
	}

	async getById(id: number) {
		const idea = await this.ideaRepository.findOne({ where: { id } });

		if (!idea) {
			throw new HttpException(
				`Registro com ID : ${id} não encontrado!`,
				HttpStatus.NOT_FOUND,
			);
		}

		return idea;
	}

	async update(id: number, data: Partial<IdeaDto>) {
		const idea = this.getById(id);
		await this.ideaRepository.update({ id }, data);
		// return await this.ideaRepository.findOne({ id });
		return idea;
	}

	async delete(id: number) {
		const idea = this.getById(id);
		await this.ideaRepository.delete({ id });
		// return { deleted: true };
		return idea;
	}
}
