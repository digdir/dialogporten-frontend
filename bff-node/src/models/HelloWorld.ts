import { Table, Column, Model } from "sequelize-typescript";

@Table
export class HelloWorld extends Model {
  @Column
  name!: string;
}
