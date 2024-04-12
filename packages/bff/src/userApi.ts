import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { ProfileRepository } from './db';
import { Profile } from './entities/Profile';
import { validateRequest } from './oidc';

const getOrCreateProfile = async (sub: string, locale: string): Promise<Profile> => {
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

const plugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.get('/api/user', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validToken = await validateRequest(request);
      if (validToken) {
        const {
          idToken: { sub, locale },
        } = validToken;
        const profile = await getOrCreateProfile(sub, locale);
        reply.send(profile);
      } else {
        reply.status(401).send({ error: 'Unauthorized' });
      }
    } catch (e) {
      console.error('Error fetching user endpoint:', e);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });

  fastify.get('/api/isAuthenticated', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const validToken = await validateRequest(request);
      if (validToken) {
        const {
          idToken: { sub, locale },
        } = validToken;

        if (sub) {
          reply.send({
            isAuthenticated: true,
          });
        }
      } else {
        reply.status(401).send({ error: 'Unauthorized' });
      }
    } catch (e) {
      console.error('Error fetching isAuthenticated endpoint:', e);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'api-user',
});
