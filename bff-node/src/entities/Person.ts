import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Family } from './Family';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  favoriteMovie: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  newColumn: number;

  @Column({ nullable: true })
  anotherColumn: number;

  @Column({ nullable: true })
  yetAnotherColumn: number;

  @Column({ nullable: true })
  finalColumn: number;

  @Column({ nullable: true })
  migrationAsJobColumn: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Family, (family) => family.people)
  family: Family;
}
