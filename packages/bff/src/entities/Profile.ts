import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryColumn()
  id: string; // sid

  @Column({ length: 255, nullable: true })
  language: string;

  @Column({ length: 255, nullable: true })
  reportee: string;

  @Column('simple-json', { nullable: true })
  settings: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
