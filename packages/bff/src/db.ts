import { DataSource, Repository } from 'typeorm';
import { Profile } from './entities/Profile.ts';
import { SavedSearch } from './entities/SavedSearch.ts';

export let ProfileRepository: Repository<Profile> | undefined = undefined;
export let SavedSearchRepository: Repository<SavedSearch> | undefined = undefined;

export const connectToDB = async () => {
  const { connectionOptions } = await import('./data-source.ts');
  const dataSource = await new DataSource(connectionOptions).initialize();

  ProfileRepository = dataSource.getRepository(Profile);
  SavedSearchRepository = dataSource.getRepository(SavedSearch);

  if (!ProfileRepository) {
    throw new Error('ProfileRepository not initialized');
  }

  return { ProfileRepository, SavedSearchRepository };
};
