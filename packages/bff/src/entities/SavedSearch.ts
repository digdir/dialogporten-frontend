import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './Profile.ts';

export type FieldOptionOperation = 'equals' | 'includes';

export interface SavedSearchData {
  filters?: Filter[];
  searchString?: string;
}

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

@Entity()
export class SavedSearch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  data: SavedSearchData;

  @Column({ length: 255, nullable: true })
  name: string;

  @ManyToOne('Profile', 'savedSearches')
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
