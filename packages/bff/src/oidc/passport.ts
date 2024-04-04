import { Issuer, Strategy as OpenIDStrategy, TokenSet } from 'openid-client';
import passport from '@fastify/passport';
import { ProfileRepository, SessionRepository } from '../db';
import { Profile } from '../entities/Profile';
import { SessionData } from '../entities/SessionData';
import { readCookie } from './cookies';
import { FastifyRequest } from 'fastify';

export const originBaseUrl = 'http://app.localhost/';

type IDPortenProfile = {
  sub: string;
  pid: string;
};

export const initPassport = async () => {
  if (!SessionRepository) {
    throw new Error('SessionRepository not initialized');
  }
  if (!ProfileRepository) {
    throw new Error('ProfileRepository not initialized');
  }

  if (!process.env.OIDC_URL) {
    throw new Error('No issuer url found in environment variables, exiting');
  }

  const idPortenIssuer = await Issuer.discover(`https://${process.env.OIDC_URL}/.well-known/openid-configuration`);
  const openIdClient = new idPortenIssuer.Client({
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: [`${process.env.HOSTNAME!}/api/cb`],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_basic',
    scope: process.env.SCOPE,
    authorizationURL: `https://login.${process.env.OIDC_URL}/authorize`,
  });

  passport.use(
    'oidc',
    new OpenIDStrategy(
      { client: openIdClient, passReqToCallback: true },
      async (req: any, tokenSet: TokenSet, idPortenProfile: any, done: any) => {
        try {
          // TODO: redirect url from postLoginRedirectUrl?
          console.log('SessionID from req', req.sessionId);
          console.log('profile', idPortenProfile);
          const postLoginRedirectUrl = originBaseUrl;
          const userId = (idPortenProfile as IDPortenProfile).pid;
          const { sid, locale, pid } = tokenSet.claims();

          const user: Profile | undefined = await getOrCreateProfile(userId, {
            language: locale || '',
          });

          if (!user) {
            throw new Error('Fatal: Unable to find/create user');
          }

          const existingSessionIdFromCookie = readCookie(req);
          let sessionId: undefined | string;

          if (existingSessionIdFromCookie) {
            const session = await getSession(existingSessionIdFromCookie);
            if (session?.id && !session?.accessToken) {
              await updateSession(sid as string, session.id, tokenSet, user);
            }

            sessionId = session?.id;
          }
          if (!sessionId) {
            const session = await createSession(sid as string, tokenSet, user, postLoginRedirectUrl);
            if (!session) {
              throw new Error('Fatal: Unable to find/create session');
            }
            sessionId = session?.id;
          }

          return done(null, {
            sid,
            pid,
            userId,
            postLoginRedirectUrl,
            currentSessionId: sessionId,
          });
        } catch (error) {
          console.error("authenticate('oidc') error: ", error);
          return done(error);
        }
      },
    ),
  );


  passport.registerUserSerializer(async(user: any) => user.userId)
  passport.registerUserDeserializer(async(userId: string) => {
    return await ProfileRepository!.findOneBy({ id: userId as string })
  });
};

const getOrCreateProfile = async (userId: string, userInfo: Partial<Profile>) => {
  try {
    let user: Profile | null = await ProfileRepository!.findOne({
      where: { id: userId },
    });

    if (!user) {
      const newProfile = new Profile();
      newProfile.id = userId;
      newProfile.language = userInfo.language || '';
      user = await ProfileRepository!.save(newProfile);
      if (!user) {
        throw new Error('Fatal: User not found and not able to create');
      }
    }

    return user;
  } catch (error) {
    console.error('getOrCreateProfile error: ', error);
  }
};

export const getSession = async (existingSessionIdFromCookie: string) => {
  return await SessionRepository!.findOneBy({ id: existingSessionIdFromCookie });
};

const createSession = async (
  idportenSessionId: string,
  tokenSet: TokenSet,
  user: Profile,
  postLoginRedirectUrl: string,
) => {
  const {
    id_token: idToken,
    refresh_token: refreshToken,
    access_token: accessToken,
    expires_at: expiresAtUnix = 1200,
  } = tokenSet;

  const accessTokenExpiresAt = new Date(expiresAtUnix * 1000);
  const refreshTokenExpiresAt = new Date();
  const refreshExpiresIn: number = process.env.REFRESH_TOKEN_EXPIRES_IN
    ? parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN)
    : 3600;
  refreshTokenExpiresAt.setSeconds(refreshTokenExpiresAt.getSeconds() + refreshExpiresIn);

  const sessionProps: Partial<SessionData> = {
    accessToken,
    accessTokenExpiresAt,
    idportenSessionId,
    refreshToken,
    refreshTokenExpiresAt,
    idToken,
    sessionData: {
      postLoginRedirectUrl,
      setFrom: 'authenticate',
    },
    ...(user && { profile: user }),
  };

  return await SessionRepository!.save(sessionProps);
};

const updateSession = async (idportenSessionId: string, sessionId: string, tokenSet: TokenSet, user: Profile) => {
  const {
    id_token: idToken,
    refresh_token: refreshToken,
    access_token: accessToken,
    expires_at: expiresAtUnix = 1200,
  } = tokenSet;

  const accessTokenExpiresAt = new Date(expiresAtUnix * 1000);
  const refreshTokenExpiresAt = new Date();
  const refreshExpiresIn: number = process.env.REFRESH_TOKEN_EXPIRES_IN
    ? parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN)
    : 3600;
  refreshTokenExpiresAt.setSeconds(refreshTokenExpiresAt.getSeconds() + refreshExpiresIn);

  const sessionProps: Partial<SessionData> = {
    accessToken,
    accessTokenExpiresAt,
    idportenSessionId,
    refreshToken,
    refreshTokenExpiresAt,
    idToken,
    ...(user && { profile: user }),
  };

  return await SessionRepository!.update(sessionId, sessionProps);
};
