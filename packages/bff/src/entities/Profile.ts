import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SavedSearch } from './SavedSearch.ts';
import { ProfileRepository } from '../db.ts';

@Entity()
export class Profile {
  @PrimaryColumn()
  sub: string;

  @Column({ length: 255, nullable: true })
  language: string;

  @OneToMany('SavedSearch', 'profile')
  savedSearches: SavedSearch[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export const getOrCreateProfile = async (sub: string, locale: string): Promise<Profile> => {
  const profile = await ProfileRepository!.findOne({
    where: { sub },
  });

  if (profile) {
    return profile;
  }

  const newProfile = new Profile();
  newProfile.sub = sub;
  newProfile.language = locale || 'nb';

  const savedProfile = await ProfileRepository!.save(newProfile);
  if (!savedProfile) {
    throw new Error('Fatal: Not able to create new profile');
  }
  return savedProfile;
};
