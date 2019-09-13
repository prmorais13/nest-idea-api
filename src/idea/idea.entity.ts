import { UserEntity } from '../user/user.entity';
import {
	PrimaryGeneratedColumn,
	CreateDateColumn,
	Column,
	Entity,
	ManyToOne,
} from 'typeorm';

@Entity('idea')
export class IdeaEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created: Date;

	@CreateDateColumn()
	updated: Date;

	@Column()
	idea: string;

	@Column()
	description: string;

	@ManyToOne(type => UserEntity, author => author.ideas)
	author: UserEntity;

	// @Column()
	// authorId: number;
}
