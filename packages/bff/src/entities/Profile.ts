import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { SessionData } from './SessionData';

@Entity()
export class Profile {
  @PrimaryColumn()
  id: string; // hashed pid

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

  @OneToMany(
    () => SessionData,
    (session) => session.profile,
  )
  sessions: SessionData[];
}
