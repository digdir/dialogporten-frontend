import oauthPlugin, { OAuth2Namespace } from '@fastify/oauth2';
import jwt from 'jsonwebtoken';
import { FastifyPluginAsync, FastifyPluginCallback, FastifyRegister, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { ProfileRepository } from '../db';
import { Profile } from '../entities/Profile';

declare module 'fastify' {
  interface FastifyInstance {
    idporten: OAuth2Namespace;
  }
}

interface PluginOptions {
  oidc_url: string;
  hostname: string;
  client_id: string;
  client_secret: string;
  refresh_token_expires_in: number;
}

interface OAuthPluginOptions {
  name: string;
  scope: string[];
  credentials: {
    client: {
      id: string;
      secret: string;
    };
  };
  startRedirectPath: string;
  callbackUri: string;
  discovery: {
    issuer: string;
  };
}



const getOrCreateProfile = async (sId: string, locale: string): Promise<Profile> => {
    const profile = await ProfileRepository!.findOne({
      where: { id: sId },
    });

    if (profile) {
      return profile;
    }

    const newProfile = new Profile();
    newProfile.id = sId;
    newProfile.language = locale || 'nb';
    const savedProfile = await ProfileRepository!.save(newProfile);
    if (!savedProfile) {
      throw new Error('Fatal: Not able to create new profile');
    }
    return savedProfile;
};

const plugin: FastifyPluginAsync<PluginOptions> = async (fastify, options) => {
  const { client_id, client_secret, oidc_url, hostname } = options;

  fastify.register<OAuthPluginOptions>(oauthPlugin as unknown as FastifyPluginCallback<OAuthPluginOptions>, {
    name: 'idporten',
    scope: ['digdir:dialogporten.noconsent', 'openid'],
    credentials: {
      client: {
        id: client_id,
        secret: client_secret,
      },
    },
    startRedirectPath: '/api/login/',
    callbackUri: `${hostname}/api/cb`,
    discovery: {
      issuer: `https://${oidc_url}/.well-known/openid-configuration`,
    },
  });

  fastify.get('/api/cb', async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const { token } = await this.idporten.getAccessTokenFromAuthorizationCodeFlow(request);
      request.session.set<any>('token', token);
      reply.redirect('/?loggedIn=true');
    } catch (e: any) {
      console.log(e);
      reply.status(500);
    }
  });

  fastify.get('/api/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    // TODO: Make logout endpoint
    // https://docs.digdir.no/docs/idporten/oidc/oidc_protocol_logout.html
    // remove cookie and destroy session
    reply.status(501);
  });

  fastify.get('/api/user', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // TODO: getAccessTokenFromAuthorizationCodeFlow does not work, invalid state
      const token = request.session.get<any>('token');
      // TODO
      //  1. verify jwt verify(token, secretOrPublicKey, [options, callback])
      // 2. check if not expired, if refresh token is valid but at is invalid, refresh at
      // return line below if neither
      if (token) {
        const { sid, locale = 'nb' } = jwt.decode((token.id_token as any)) as any;
        const profile = getOrCreateProfile(sid, locale);
        reply.send(profile);
      } else {
        reply.status(401).send({ error: 'Unauthorized' });
      }

    } catch (e) {
      console.error('Error fetching user endpoint:', e);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'fastify-oicd',
});
