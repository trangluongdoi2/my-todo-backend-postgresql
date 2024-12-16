import { Request, Response, NextFunction } from 'express';
import jwkToPem from 'jwk-to-pem';
import jwt from 'jsonwebtoken';

const pems: { [key: string]: any } = {};

class AuthMiddleWare {
  private poolRegion: string = 'ap-southeast-1';
  private userPoolId: string = 'ap-southeast-1_h4AcbDbZI';
  constructor() {
    this.setUp();
  }

  verifyToken(req: Request, res: Response, next: NextFunction) {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decodedJwt: any = jwt.decode(token, { complete: true });
    if (decodedJwt === null) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const kid = decodedJwt.header.kid;
    const pem = pems[kid];
    if (!pem) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    jwt.verify(token, pem, (err: any, payload: any) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();
    });
  }

  private async setUp() {
    const URL = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;
    try {
      const response = await fetch(URL);
      if (response.status !== 200) {
        throw new Error('Failed to fetch JWKS');
      }
      const data = await response.json();
      const { keys } = data;
      for (let i = 0; i < keys.length; i++) {
        const key_id = keys[i].kid;
        const modulus = keys[i].n;
        const exponent = keys[i].e;
        const key_type = keys[i].kty;
        const jwk = { kty: key_type, n: modulus, e: exponent };
        const pem = jwkToPem(jwk);
        pems[key_id] = pem;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const authMiddleWare = new AuthMiddleWare();
