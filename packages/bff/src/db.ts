import { DataSource, Repository } from 'typeorm';
import { Profile } from './entities/Profile';
import { SessionData } from './entities/SessionData';

export let SessionRepository: Repository<SessionData> | undefined = undefined;
export let ProfileRepository: Repository<Profile> | undefined = undefined;

export const connectToDB = async () => {
  const { connectionOptions } = await import('./data-source');
  const dataSource = await new DataSource(connectionOptions).initialize();

  SessionRepository = dataSource.getRepository(SessionData);
  ProfileRepository = dataSource.getRepository(Profile);

  if (!SessionRepository) {
    throw new Error('SessionRepository not initialized');
  }
  if (!ProfileRepository) {
    throw new Error('ProfileRepository not initialized');
  }

  return { SessionRepository, ProfileRepository };
};
