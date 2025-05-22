import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';

const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

export function setupCsrf(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith('/api/auth')) {
    return next();
  }

  csrfProtection(req, res, (err: any) => {
    if (err?.code === 'EBADCSRFTOKEN') {
      return res.status(403).json({
        status: 'fail',
        message: 'Invalid or expired security token',
      });
    }

    // Set double submit cookies
    const token = req.csrfToken();

    // Set the main CSRF token as httpOnly cookie
    res.cookie('CSRF-TOKEN', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Set a masked version in header for the double-submit pattern
    res.header('X-CSRF-Token', token.slice(-8));
    next();
  });
}
