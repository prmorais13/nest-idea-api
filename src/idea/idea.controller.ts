import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
} from '@nestjs/common';

import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto.interface';

@Controller('idea')
export class IdeaController {
	constructor(private ideaService: IdeaService) {}

	@Get()
	getAllIdeas() {
		return this.ideaService.getAll();
	}

	@Post()
	createIdea(@Body() data: IdeaDto) {
		return this.ideaService.create(data);
	}

	@Get(':id')
	getIdeaById(@Param('id') id: number) {
		return this.ideaService.getById(id);
	}

	@Put(':id')
	updateIdea(@Param('id') id: number, @Body() data: Partial<IdeaDto>) {
		return this.ideaService.update(id, data);
	}

	@Delete(':id')
	deleteIdea(@Param('id') id: number) {
		return this.ideaService.delete(id);
	}
}
