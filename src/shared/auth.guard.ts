import {
	CanActivate,
	ExecutionContext,
	Injectable,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		if (request) {
			if (!request.headers.authorization) {
				return false;
			}
			request.user = await this.validateToken(request.headers.authorization);
			return true;
		} else {
			const ctx: any = GqlExecutionContext.create(context);
			if (!ctx.headers.authorization) {
				return false;
			}
			ctx.user = await this.validateToken(ctx.headers.authorazation);
			return true;
		}
	}

	async validateToken(auth: string): Promise<any> {
		if (auth.split(' ')[0] !== 'Bearer') {
			throw new HttpException('Token inválido!', HttpStatus.FORBIDDEN);
		}

		const token = auth.split(' ')[1];
		try {
			const decoded = jwt.verify(token, process.env.SECRET);
			return decoded;
		} catch (error) {
			const msg = `Token error ${error.message || error.name}!`;
			throw new HttpException(msg, HttpStatus.FORBIDDEN);
		}
	}
}
