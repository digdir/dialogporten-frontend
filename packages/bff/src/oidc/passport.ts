import { Issuer, Strategy as OpenIDStrategy, TokenSet } from 'openid-client';
import passport from 'passport';
import { ProfileRepository, SessionRepository } from '../db';
import { Profile } from '../entities/Profile';
import { SessionData } from '../entities/SessionData';
import { readCookie } from './cookies';

type IDPortenProfile = {
  sub: string;
  pid: string;
};

export const initPassport = async () => {
  if (!SessionRepository) throw new Error('SessionRepository not initialized');
  if (!ProfileRepository) throw new Error('ProfileRepository not initialized');
  if (!process.env.OIDC_URL) {
    console.error('No issuer url found in environment variables, exiting');
    process.exit(1);
  }

  const idportenIssuer = await Issuer.discover(`https://${process.env.OIDC_URL}/.well-known/openid-configuration`).then(
    async (idportenIssuer) => {
      return idportenIssuer;
    },
  );

  const client = new idportenIssuer.Client({
    client_id: process.env.CLIENT_ID!,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: [`${process.env.HOSTNAME!}/auth/cb`],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_basic',
    scope: process.env.SCOPE,
    authorizationURL: `https://login.${process.env.OIDC_URL}/authorize`,
  });

  passport.use(
    'oidc',
    new OpenIDStrategy(
      { client, passReqToCallback: true },
      async (req: any, tokenSet: TokenSet, profile: any, done: any) => {
        try {
          const idPortenProfile: IDPortenProfile = profile;
          const postLoginRedirectUrl = req.session.returnTo || '/';
          const userId = idPortenProfile.pid;
          const { sid, locale, pid } = tokenSet.claims();

          const user: Profile | null = await getOrCreateProfile(userId, {
            language: locale || '',
          });
          if (!user) throw new Error('Fatal: Unable to find/create user');

          const existingSessionIdFromCookie = readCookie(req);

          let sessionId = null;
          if (existingSessionIdFromCookie) {
            const session = await getSession(existingSessionIdFromCookie);
            sessionId = session?.id;
          }
          if (!sessionId) {
            const session = await createSession(sid as string, tokenSet, user, postLoginRedirectUrl);
            sessionId = session?.id;
          }

          if (!sessionId) throw new Error('Fatal: Unable to find/create session');

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

  passport.serializeUser((user: any, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser((userId: string, done) => {
    // Use the ID to find the user in your database
    ProfileRepository!.findOneBy({ id: userId as string }).then((p) => done(null, p || false));
  });
};

const getOrCreateProfile = async (userId: string, userInfo: Partial<Profile>) => {
  try {
    let user: Profile | null = await ProfileRepository!.findOne({ where: { id: userId } });

    if (!user) {
      const newProfile = new Profile();
      newProfile.id = userId;
      newProfile.language = userInfo.language || '';
      user = await ProfileRepository!.save(newProfile);
      if (!user) throw new Error('Fatal: User not found and not able to create');
    }

    return user;
  } catch (error) {
    console.error('getOrCreateProfile error: ', error);
  }
  return null;
};

const getSession = async (existingSessionIdFromCookie: string) =>
  await SessionRepository!.findOneBy({ id: existingSessionIdFromCookie });

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
    idportenSessionId: idportenSessionId || undefined,
    refreshToken,
    refreshTokenExpiresAt,
    idToken,
    sessionData: {
      postLoginRedirectUrl,
      setFrom: 'authenticate',
    },
    ...(user && { profile: user }),
  };

  const session = await SessionRepository!.save(sessionProps);
  return session;
};
