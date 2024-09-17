import { DataSource, type Repository } from 'typeorm';
import { ProfileTable, SavedSearch } from './entities.ts';
import { connectionOptions } from './data-source.ts';

export let ProfileRepository: Repository<ProfileTable> | undefined = undefined;
export let SavedSearchRepository: Repository<SavedSearch> | undefined = undefined;

export let dataSource: DataSource | undefined = undefined;

export const connectToDB = async () => {
  dataSource = await new DataSource(connectionOptions).initialize();

  ProfileRepository = dataSource.getRepository(ProfileTable);
  SavedSearchRepository = dataSource.getRepository(SavedSearch);

  if (!ProfileRepository) {
    throw new Error('ProfileRepository not initialized');
  }
  if (!SavedSearchRepository) {
    throw new Error('SavedSearchRepository not initialized');
  }

  return { ProfileRepository, SavedSearchRepository, dataSource };
};
