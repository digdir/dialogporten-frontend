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

@Entity({ name: 'Profile' })
export class ProfileTable {
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

export type FieldOptionOperation = 'equals' | 'includes';

interface ValueFilter {
  fieldName: string | ((item: Record<string, string | number | boolean>) => string);
  operation: FieldOptionOperation;
  value: string;
  label: string;
}

export interface UnsetValueFilter {
  fieldName: string;
  operation: 'unset';
  label: string;
  value?: string | string[];
}

export type Filter = ValueFilter | UnsetValueFilter;

export interface SavedSearchData {
  filters?: Filter[];
  searchString?: string;
}
@Entity()
export class SavedSearch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  data: SavedSearchData;

  @Column({ length: 255, nullable: true })
  name: string;

  @ManyToOne('Profile', 'savedSearches')
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

  if (profile) {
    return profile;
  }

  const newProfile = new ProfileTable();
  newProfile.sub = sub;
  newProfile.language = locale || 'nb';

  const savedProfile = await ProfileRepository!.save(newProfile);
  if (!savedProfile) {
    throw new Error('Fatal: Not able to create new profile');
  }
  return savedProfile;
};
