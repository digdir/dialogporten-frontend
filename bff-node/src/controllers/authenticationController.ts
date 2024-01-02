import { Request, Response } from 'express';
import passport from 'passport';
import { deleteCookie, readCookie, setCookie } from '../util/sessionUtils';
import { SessionData } from '../entities/SessionData';
import { SessionRepository } from '..';
import '../config/env';
import { Session } from 'express-session';

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

const login = async (req: Express.Request, res: Response, next: any) => {
  const newSessionProps = {
    sessionData: { postLoginRedirectUrl: req.session?.returnTo || '/' },
    setFrom: 'login',
  };
  const newSession = await SessionRepository!.save(newSessionProps);

  req.session!.sessionId = newSession.id;
  setCookie(res, newSession.id);

  passport.authenticate('oidc')(req, res, next);
};

const logout = async function (req: any, res: any, next: any) {
  const sessionCookie = readCookie(req);

  const currentSession: SessionData | null = await SessionRepository!.findOneBy({
    id: sessionCookie as string,
  });

  const logoutUri = process.env.LOGOUT_URI;
  const logoutRedirectUri = process.env.LOGOUT_REDIRECT_URI;

  if (currentSession && logoutUri && logoutRedirectUri) {
    const logoutRedirectUrl = `${logoutUri}?post_logout_redirect_uri=${logoutRedirectUri}&id_token_hint=${currentSession.idToken}`;

    req.logout(function (err: Error) {
      if (err) {
        console.error('Logout Error:', err);
        return next(err);
      }

      if (req.session) {
        deleteCookie(res);
        req.session.destroy(function (err: Error) {
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
    res.redirect('/auth/loggedout');
  }
};

const protectedEndpoint = async (req: CustomRequest, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.json({
    message: `You are now logged in (This content requires user to be logged in). Your user id is: ${req?.user?.id}`,
  });
};

const callback = async (req: CustomRequest, res: any) => {
  try {
    let userRequestedUrl = req.user?.postLoginRedirectUrl;
    let currentSessionId = req.user?.currentSessionId;
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
      res.redirect('/fail');
      return;
    }

    userRequestedUrl = currentSession?.sessionData?.postLoginRedirectUrl || userRequestedUrl;
    setCookie(res, currentSession.id);
    res.redirect(userRequestedUrl || '/');
  } catch (error) {
    console.error('Error in OIDC callback:', error);
    res.redirect('/fail');
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
