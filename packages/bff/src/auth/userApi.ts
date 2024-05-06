import axios from 'axios';
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { SavedSearchRepository } from '../db.ts';
import { Filter, SavedSearch, getOrCreateProfile } from '../entities.ts';

interface SavedSearchData {
  filters?: Filter[];
  searchString?: string;
}

interface SavedSearchDTO {
  name: string;
  data?: SavedSearchData;
  searchString?: string;
}

interface RequestBody {
  data?: SavedSearchDTO;
  searchId?: number;
}

const plugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.post(
    '/api/test',
    { preValidation: fastify.verifyToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = request.session.get('token');
        const headers = {
          'content-type': 'application/json',
          Authorization: `Bearer ${token!.access_token}`,
        };

        const response = await axios({
          method: 'POST',
          url: 'https://dp-be-test-graphql-ca.lemonisland-e7641482.norwayeast.azurecontainerapps.io/graphql',
          data: request.body,
          headers,
        });
        reply.send(response.data);
      } catch (e) {
        reply.status(500).send({ error: 'Internal Server Error', message: (e as unknown as Error).message });
      }
    },
  );

  fastify.get(
    '/api/isAuthenticated',
    { preValidation: fastify.verifyToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        reply.send({
          isAuthenticated: true,
        });
      } catch (e) {
        console.error('Error fetching isAuthenticated endpoint:', e);
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    },
  );

  fastify.post(
    '/api/saved-search',
    { preValidation: fastify.verifyToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const customRequest: FastifyRequest<{ Body: RequestBody }> = request as FastifyRequest<{ Body: RequestBody }>;
      const { data: newSearch } = customRequest.body;

      if (!newSearch) {
        console.error({ error: 'No new search data received' });
        return reply.status(400).send({ error: 'No new search data received' });
      }

      if (!SavedSearchRepository) {
        console.error({ error: 'SavedSearchRepository not found' });
        return reply.status(500).send({ error: 'SavedSearchRepository not found' });
      }

      try {
        const sub = request.session.get('sub')!;
        if (!sub) {
          console.error({ error: 'Profile ID missing in session data' });
          return reply.status(404).send({ error: 'Profile ID missing in session data' });
        }
        const locale = request.session.get('locale')!;
        const profile = await getOrCreateProfile(sub, locale);
        if (!profile) {
          console.log({ error: 'Profile not found' });
          return reply.status(404).send({ error: 'Profile not found' });
        }
        const savedSearch = new SavedSearch();
        savedSearch.data = newSearch.data || {};
        savedSearch.name = newSearch.name;
        savedSearch.profile = profile;
        const createdSavedSearch = await SavedSearchRepository?.save(savedSearch);
        reply.send(createdSavedSearch);
      } catch (error) {
        console.error(error);
      }
    },
  );

  fastify.delete(
    '/api/saved-search',
    { preValidation: fastify.verifyToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const sub = request.session.get('sub')!;
        if (!sub) {
          console.error({ error: 'Profile ID missing in session data' });
          return reply.status(404).send({ error: 'Profile ID missing in session data' });
        }
        const savedsearchId =
          typeof request.headers?.savedsearchid === 'string' ? parseInt(request.headers?.savedsearchid) : 0;

        if (!savedsearchId) {
          console.log({ error: 'Saved search id not found' });
          return reply.status(404).send({ error: 'Saved search id not found' });
        }

        if (!SavedSearchRepository) {
          console.error({ error: 'SavedSearchRepository not found' });
          return reply.status(500).send({ error: 'SavedSearchRepository not found' });
        }
        const savedSearch = await SavedSearchRepository.findOne({
          where: { id: savedsearchId },
          relations: ['profile'],
        });
        if (savedSearch?.profile?.sub !== sub) {
          console.error({ error: 'Saved search does not belong to logged in user' });
          return reply.status(403).send({ error: 'Saved search does not belong to logged in user' });
        }
        await SavedSearchRepository.delete(savedsearchId);
        reply.status(200).send({ message: 'Successfully deleted Saved search' });
      } catch (error) {
        console.error(error);
      }
    },
  );

  fastify.get(
    '/api/saved-search',
    { preValidation: fastify.verifyToken },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const sub = request.session.get('sub')!;

        if (!SavedSearchRepository) {
          console.error({ error: 'SavedSearchRepository not found' });
          return reply.status(500).send({ error: 'SavedSearchRepository not found' });
        }

        if (!sub) {
          console.error({ error: 'Profile ID missing in session data' });
          return reply.status(404).send({ error: 'Profile ID missing in session data' });
        }

        const savedSearches = await SavedSearchRepository.find({
          where: { profile: { sub } },
        });

        reply.send(savedSearches);
      } catch (e) {
        console.log('Uncaught error', e);
        reply.status(500).send(e);
      }
    },
  );
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'api-user',
});
