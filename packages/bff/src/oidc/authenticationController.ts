import { Request, Response } from 'express';
import { Session } from 'express-session';
import passport from 'passport';
import { SessionRepository } from '..';
import { SessionData } from '../entities/SessionData';
import { deleteCookie, readCookie, setCookie } from './sessionUtils';

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
    const postLoginRedirectUrl = req.query.postLoginRedirectUrl ??  '/'
    const newSessionProps = {
      sessionData: { postLoginRedirectUrl },
      setFrom: 'login', // TODO: Debugging purposes. Remove before prod
    };
    const newSession = await SessionRepository!.save(newSessionProps);
    req.session!.sessionId = newSession.id;
    setCookie(res, newSession.id);
    passport.authenticate('oidc')(req, res, next);
  } catch (e) {
    console.log('error in login', e)
  }
};

const logout = async (req: any, res: any, next: any) => {
  const sessionCookie = readCookie(req);
  const currentSession: SessionData | null = await SessionRepository!.findOneBy({
    id: sessionCookie as string,
  });

  const logoutUri = `https://login.${process.env.OIDC_URL}/logout`;
  const logoutRedirectUri = `${process.env.HOSTNAME!}/auth/loggedout`;

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
    res.redirect('/auth/loggedout');
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
