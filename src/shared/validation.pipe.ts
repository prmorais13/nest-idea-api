import {
	ArgumentMetadata,
	Injectable,
	PipeTransform,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		if (value instanceof Object && this.isEmpty(value)) {
			throw new HttpException('Erro de validação', HttpStatus.BAD_REQUEST);
		}
		const { metatype } = metadata;

		if (!metatype || !this.toValidate(metatype)) {
			return value;
		}
		const object = plainToClass(metatype, value);
		const errors = await validate(object);

		if (errors.length > 0) {
			throw new HttpException(
				`Falha de validação ${this.formatErrors(errors)}`,
				HttpStatus.BAD_REQUEST,
			);
		}
		return value;
	}

	private toValidate(metatype: any): boolean {
		const types: any = [String, Boolean, Number, Array, Object];
		return !types.includes(metatype);
	}

	private formatErrors(errors: any[]) {
		return errors
			.map(err => {
				// tslint:disable-next-line: forin
				for (const property in err.constraints) {
					return err.constraints[property];
				}
			})
			.join(', ');
	}

	private isEmpty(value: any) {
		if (Object.keys(value).length > 0) {
			return false;
		}
		return true;
	}
}
