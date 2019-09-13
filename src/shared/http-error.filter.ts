import { HttpStatus } from '@nestjs/common';
import {
	ArgumentsHost,
	Catch,
	HttpException,
	ExceptionFilter,
	Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest();
		const response = ctx.getResponse();
		const status = exception.getStatus();

		const errorResponse = {
			code: status,
			timestamp: new Date().toLocaleDateString(),
			path: request.url,
			method: request.method,
			message:
				status !== HttpStatus.INTERNAL_SERVER_ERROR
					? exception.message.error || exception.message || null
					: 'Erro inesperado no servidor!',
		};

		Logger.error(
			`${request.method} ${request.url}`,
			exception.stack,
			'ExceptionFilter',
		);
		response.status(status).json({ errorResponse });
	}
}
