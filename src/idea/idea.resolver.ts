import { Resolver, Query, Args } from '@nestjs/graphql';
import { IdeaService } from './idea.service';

@Resolver('Idea')
export class IdeaResolver {
	constructor(private ideaService: IdeaService) {}

	@Query()
	ideas(@Args('page') page: number) {
		return this.ideaService.getAll(page);
	}
}
