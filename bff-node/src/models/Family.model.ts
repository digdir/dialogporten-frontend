import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Person } from './Person.model';

@Table
export class Family extends Model<Family> {
  @Column
  name!: string;

  @HasMany(() => Person)
  members!: Person[];
}
