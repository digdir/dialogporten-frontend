import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Profile } from './Profile';

@Entity()
export class SessionData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  idportenSessionId: string;

  @Column({ length: 20, nullable: true })
  profileId: string;

  @Column({ type: 'text', nullable: true })
  accessToken: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  accessTokenExpiresAt: Date;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  refreshTokenExpiresAt: Date;

  @Column({ type: 'text', nullable: true })
  idToken: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column('simple-json', { nullable: true })
  sessionData: any;

  @ManyToOne(() => Profile, (profile) => profile.sessions)
  profile: Profile;
}
