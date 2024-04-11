import oauthPlugin, { OAuth2Namespace } from '@fastify/oauth2';
import { FastifyPluginAsync, FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyInstance {
    idporten: OAuth2Namespace;
  }
}

declare module 'fastify' {
  interface Session {
    token: SessionStorageToken;
  }
}

interface SessionStorageToken {
  [key: string]:
    | {
        access_token: string;
        refresh_token: string;
        id_token: string;
      }
    | undefined;
}

interface CustomOICDPluginOptions {
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

interface IdTokenPayload {
  sub: string;
  locale: string;
}
interface ValidToken {
  idToken: IdTokenPayload;
}

export async function validateRequest(request: FastifyRequest): Promise<ValidToken | undefined> {
  const token = request.session.get('token') as unknown as SessionStorageToken;

  if (!token?.id_token) {
    return undefined;
  }
  const { sub, locale = 'nb' } = jwt.decode(token.id_token as unknown as string) as IdTokenPayload;

  /* TODO
    1. jwt.verify(token, secretKey) => not valid -> return undefined
    2. check expiration of token and refresh token, refresh if needed
   */

  return {
    idToken: { sub, locale },
  } as ValidToken;
}

const plugin: FastifyPluginAsync<CustomOICDPluginOptions> = async (fastify, options) => {
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
      request.session.set('token', token);
      reply.redirect('/?loggedIn=true');
    } catch (e) {
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
};

export default fp(plugin, {
  fastify: '4.x',
  name: 'fastify-oicd',
});
