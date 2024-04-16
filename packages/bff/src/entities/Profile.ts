import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ProfileRepository } from '../db';

@Entity()
export class Profile {
  @PrimaryColumn()
  sub: string;

  @Column({ length: 255, nullable: true })
  language: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
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
