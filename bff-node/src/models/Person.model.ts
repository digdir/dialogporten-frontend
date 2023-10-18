import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Person extends Model {
  @Column
  name!: string;
}
