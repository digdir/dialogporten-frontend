import { ProfileRepository } from '../../db.ts';
import { ProfileTable } from '../../entities.ts';

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
