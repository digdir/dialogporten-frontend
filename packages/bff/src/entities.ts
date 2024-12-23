import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProfileRepository } from './db.ts';

@Entity({ name: 'profile' })
export class ProfileTable {
  @PrimaryColumn()
  sub: string;

  @Column({ length: 255, nullable: true })
  language: string;

  @OneToMany('saved_search', 'profile')
  savedSearches: SavedSearch[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export interface Filter {
  id: string;
  value: string;
}

export interface SavedSearchData {
  filters?: Filter[];
  searchString?: string;
  fromView?: string;
}

@Entity({ name: 'saved_search' })
export class SavedSearch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  data: SavedSearchData;

  @Column({ length: 255, nullable: true })
  name: string;

  @ManyToOne('profile', 'saved_search')
  profile: ProfileTable;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

export const getOrCreateProfile = async (sub: string, locale: string): Promise<ProfileTable> => {
  const profile = await ProfileRepository!.findOne({
    where: { sub },
  });

  if (!profile) {
    const newProfile = new ProfileTable();
    newProfile.sub = sub;
    newProfile.language = locale || 'nb';

    const savedProfile = await ProfileRepository!.save(newProfile);
    if (!savedProfile) {
      throw new Error('Fatal: Not able to create new profile');
    }
    return savedProfile;
  }
  if (profile?.language !== locale) {
    profile.language = locale;
    await ProfileRepository!.save(profile);
  }
  return profile;
};
