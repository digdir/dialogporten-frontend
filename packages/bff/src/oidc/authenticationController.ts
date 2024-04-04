import { Request, Response } from 'express';
import { Session } from 'express-session';
import passport from 'passport';
import { SessionRepository } from '../db';
import { SessionData } from '../entities/SessionData';
import { deleteCookie, readCookie, setCookie } from './cookies';
import { getSession } from './passport';

const logoutUri = `https://login.${process.env.OIDC_URL}/logout`;
const logoutRedirectUri = `${process.env.HOSTNAME!}/api/loggedout`;
const loggedoutURL = '/api/loggedout';

interface CustomSession extends Session, Partial<SessionData> {
  returnTo?: string;
  sessionId?: string;

  // Override the conflicting property
  // Choose the type based on how 'id' is defined in your session store
  id: string; // or another type that matches both Session and SessionData
}

export interface CustomRequest extends Request {
  session: CustomSession;
  user?: {
    postLoginRedirectUrl: string;
    currentSessionId: string;
    sid: string;
    pid: string;
    userId: string;
    id: string;
  };
}

const login = async (req: any, res: Response, next: any) => {
  try {
    const postLoginRedirectUrl = req.query.postLoginRedirectUrl ?? '/';
    const sessionProps: Partial<SessionData> = {
      sessionData: { postLoginRedirectUrl },
    };

    // Check if user has a cookie already
    const existingSessionIdFromCookie = readCookie(req);

    // Check if session actually exists in DB
    const existingSession = existingSessionIdFromCookie && (await getSession(existingSessionIdFromCookie));

    if (existingSession?.id) {
      await SessionRepository!.update(existingSession.id, sessionProps);
      req.session!.sessionId = existingSession.id;
    } else {
      const newSession = await SessionRepository!.save(sessionProps);
      req.session!.sessionId = newSession.id;
    }

    setCookie(res, req.session!.sessionId);
    passport.authenticate('oidc')(req, res, next);
  } catch (e) {
    console.log('error in login', e);
  }
};

const logout = async (req: any, res: any, next: any) => {
  const sessionCookie = readCookie(req);
  const currentSession: SessionData | null = await SessionRepository!.findOneBy({
    id: sessionCookie as string,
  });

  if (currentSession && logoutUri && logoutRedirectUri) {
    const logoutRedirectUrl = `${logoutUri}?post_logout_redirect_uri=${logoutRedirectUri}&id_token_hint=${currentSession.idToken}`;

    req.logout((err: Error) => {
      if (err) {
        console.error('Logout Error:', err);
        return next(err);
      }

      if (req.session) {
        deleteCookie(res);
        req.session.destroy((err: Error) => {
          if (err) {
            console.error('Error destroying session:', err);
            return next(err);
          }

          SessionRepository!.delete(currentSession.id);
        });
      } else {
        deleteCookie(res);
      }
      res.redirect(logoutRedirectUrl);
    });
  } else {
    res.redirect(loggedoutURL);
  }
};

const protectedEndpoint = async (req: CustomRequest, res: Response) => {
  res.json({
    message: `You are now logged in (This content requires user to be logged in). Your user id is: ${req?.user?.id}`,
  });
};

const callback = async (req: CustomRequest, res: any) => {
  try {
    let userRequestedUrl = req.user?.postLoginRedirectUrl;
    const currentSessionId = req.user?.currentSessionId;
    let currentSession;

    if (currentSessionId) {
      currentSession = await SessionRepository!.findOneBy({ id: currentSessionId as string });
    } else if (req.user?.sid) {
      // No session found, creating new session
      const newSession = new SessionData();
      newSession.sessionData = { postLoginRedirectUrl: userRequestedUrl, setFrom: 'cb' };
      newSession.idportenSessionId = req.user?.sid;
      currentSession = await SessionRepository!.save(newSession);
    }

    if (!currentSession?.id) {
      return res.redirect('/fail');
    }

    userRequestedUrl = currentSession?.sessionData?.postLoginRedirectUrl || userRequestedUrl;
    setCookie(res, currentSession.id);
    res.redirect(userRequestedUrl || '/');
  } catch (error) {
    console.error('Error in OIDC callback:', error);
    res.redirect('/api/fail');
  }
};
const fail = async (req: Request, res: Response) => res.send('Failed');
const loggedOut = async (req: Request, res: Response) => res.send('Logged out');

export const authenticationController = {
  login,
  logout,
  protectedEndpoint,
  loggedOut,
  fail,
  callback,
};
