import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { IdeaEntity } from './idea.entity';
import { UserEntity } from '../user/user.entity';
import { IdeaResolver } from './idea.resolver';

@Module({
	imports: [TypeOrmModule.forFeature([IdeaEntity, UserEntity])],
	controllers: [IdeaController],
	providers: [IdeaService, IdeaResolver],
})
export class IdeaModule {}
