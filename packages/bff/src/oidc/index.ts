import fp from 'fastify-plugin';
import Fastify, { FastifyPluginAsync } from 'fastify';
import fastifyPassport from '@fastify/passport';
import { ensureAuthenticated } from './ensureAuthenticated';

import { FastifyRequest, FastifyReply } from 'fastify';
import { fastifySession } from '@fastify/session';
import passport from '@fastify/passport';
import { SessionRepository } from '../db';
import { SessionData } from '../entities/SessionData';
import { deleteCookie, readCookie, setCookie } from './cookies';
import { getSession, initPassport } from './passport';

const logoutUri = `https://login.${process.env.OIDC_URL}/logout`;
const logoutRedirectUri = `${process.env.HOSTNAME!}/api/loggedout`;
const loggedoutURL = '/api/loggedout';

type FastifySession = typeof fastifySession;
interface CustomSession extends FastifySession, Partial<SessionData> {
  returnTo?: string;
  sessionId?: string;
  id: string;
}

interface postLoginRedirectQuery {
  postLoginRedirectUrl: string;
}

export interface CustomRequest extends Omit<FastifyRequest, 'session'> {
  session: CustomSession;
  query: postLoginRedirectQuery;
  user?: {
    postLoginRedirectUrl: string;
    currentSessionId: string;
    sid: string;
    pid: string;
    userId: string;
    id: string;
  };
}

const plugin: FastifyPluginAsync = async (fastify) => {

  const login = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const customRequest: CustomRequest = req as unknown as CustomRequest;
      const postLoginRedirectUrl = customRequest.query.postLoginRedirectUrl ?? '/';
      const sessionProps: Partial<SessionData> = {
        sessionData: { postLoginRedirectUrl },
      };

      const existingSessionIdFromCookie = readCookie(req);
      const existingSession = existingSessionIdFromCookie && (await getSession(existingSessionIdFromCookie));
      let sessionId;

      if (existingSession && existingSession?.id) {
        await SessionRepository!.update(existingSession.id, sessionProps);
        sessionId = existingSession.id;
      } else {
        const newSession = await SessionRepository!.save(sessionProps);
        sessionId = newSession.id;
      }
      if (req?.session) {
        (req as FastifyRequest & {sessionId: string}).sessionId = sessionId;
      }
      setCookie(res, sessionId);
      passport.authenticate('oidc');

    } catch (e) {
      console.log('error in login', e);
    }
  };

  const logout = async (req: FastifyRequest, res: FastifyReply) => {
    const sessionCookie = readCookie(req);
    const customRequest: CustomRequest = req as unknown as CustomRequest;
    const currentSession: SessionData | null = await SessionRepository!.findOneBy({
      id: sessionCookie as string,
    });

    if (currentSession && logoutUri && logoutRedirectUri) {
      const logoutRedirectUrl = `${logoutUri}?post_logout_redirect_uri=${logoutRedirectUri}&id_token_hint=${currentSession.idToken}`;
      await req.logout()
      await req.session.destroy();
      await deleteCookie(res);

      res.redirect(logoutRedirectUrl);
    } else {
      res.redirect(loggedoutURL);
    }
  };

  const protectedEndpoint = async (req: FastifyRequest, res: FastifyReply) => {
    const customRequest: CustomRequest = req as unknown as CustomRequest;
    res.send({
      message: `You are now logged in (This content requires user to be logged in). Your user id is: ${customRequest?.user?.id}`,
    });
  };

  const callback = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const customRequest: CustomRequest = req as unknown as CustomRequest;
      let userRequestedUrl = customRequest.user?.postLoginRedirectUrl ?? '/';
      const currentSessionId = customRequest.user?.currentSessionId;
      let currentSession: SessionData | undefined | null;

      if (currentSessionId) {
        currentSession = await SessionRepository!.findOneBy({ id: currentSessionId as string });
      } else if (customRequest.user?.sid) {
        // No session found, creating new session
        const newSession = new SessionData();
        newSession.sessionData = {
          postLoginRedirectUrl: userRequestedUrl,
          setFrom: 'cb',
          idportenSessionId: customRequest?.user?.sid,
        };
        currentSession = await SessionRepository!.save(newSession);
      }

      if (!currentSession?.id) {
        return res.redirect('/api/fail');
      }
      userRequestedUrl = currentSession?.sessionData?.postLoginRedirectUrl || userRequestedUrl;
      setCookie(res, currentSession.id);
      res.redirect(userRequestedUrl);
    } catch (error) {
      console.error('Error in OIDC callback:', error);
      res.redirect('/api/fail');
    }
  };
  const fail = async (_: FastifyRequest, res: FastifyReply) => res.send('Failed');
  const loggedOut = async (_: FastifyRequest, res: FastifyReply) => res.send('Logged out');

  // passport
  fastify.register(passport.initialize());
  fastify.register(passport.secureSession())
  await initPassport();

  fastify.get('/api/fail', {}, fail);
  fastify.get('/api/loggedout', {}, loggedOut);
  fastify.get('/api/login', {}, login);
  fastify.get('/api/logout', {}, logout);
  fastify.get('/api/cb', {
    preValidation: fastifyPassport.authenticate('oidc', {
      authInfo: false,
      failureRedirect: '/api/login'
    })
  }, callback);

  fastify.get('/api/protected', {
    preValidation: [ensureAuthenticated]
  }, protectedEndpoint);
}

export default fp(plugin, {
  fastify: '4.x',
  name: 'fastify-oicd',
});