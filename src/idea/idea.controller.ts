import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	UsePipes,
	UseGuards,
	Query,
} from '@nestjs/common';

import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto.interface';
import { ValidationPipe } from './../shared/validation.pipe';
import { User } from '../user/user.decorator';
import { UserEntity } from '../user/user.entity';
import { AuthGuard } from '../shared/auth.guard';

@Controller('api/idea')
export class IdeaController {
	constructor(private ideaService: IdeaService) {}

	// @Get()
	// @UseGuards(AuthGuard)
	// getAllIdeas(@User() author: UserEntity) {
	// 	return this.ideaService.getAll(author);
	// }

	@Get()
	getAllIdeas(@Query('page') page: number) {
		return this.ideaService.getAll(page);
	}

	@Post()
	@UsePipes(ValidationPipe)
	@UseGuards(AuthGuard)
	createIdea(@User() author: UserEntity, @Body() data: IdeaDto) {
		return this.ideaService.create(author, data);
	}

	@Get(':id')
	@UseGuards(AuthGuard)
	getIdeaById(@Param('id') id: number) {
		return this.ideaService.getById(id);
	}

	@Put(':id')
	@UsePipes(ValidationPipe)
	@UseGuards(AuthGuard)
	updateIdea(
		@Param('id') id: number,
		@User() user: UserEntity,
		@Body() data: Partial<IdeaDto>,
	) {
		return this.ideaService.update(id, user, data);
	}

	@Delete(':id')
	@UseGuards(AuthGuard)
	deleteIdea(@Param('id') id: number, @User() user: UserEntity) {
		return this.ideaService.delete(id, user);
	}
}
