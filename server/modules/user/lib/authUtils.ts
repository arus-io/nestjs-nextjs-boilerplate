import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';

const saltRounds = 10;

export class AuthUtils {
  static hashPassword = (plainTextPassword: string): Promise<string> => bcrypt.hash(plainTextPassword, saltRounds);

  static comparePassword = (plainTextPassword: string, hashedPassword: string): Promise<boolean> =>
    bcrypt.compare(plainTextPassword, hashedPassword);

  static signJwt = async (
    secret: string,
    payload: any,
    expInSecs: number,
    opts = {},
  ): Promise<{ token: string; iat: number; exp: number }> => {
    const defaultOptions = {};
    const options = {
      ...defaultOptions,
      ...opts,
    };
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + expInSecs;
    const token = await new Promise<string>((resolve, reject) =>
      jwt.sign({ ...payload, iat, exp }, secret, options, (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }),
    );
    return { token, iat, exp };
  };

  static verifyJwt = (secretOrPublicKey: string, token: any) => {
    return new Promise<any>((resolve, reject) =>
      jwt.verify(token, secretOrPublicKey, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      }),
    );
  };

  // ---------  2FA ------------
  static async generate2FASecret(): Promise<{
    base32: string;
    otpauth_url: string;
  }> {
    const secret = speakeasy.generateSecret({
      otpauth_url: true, // get an url for qr
      name: 'Backend platform', //@TODO: move to var
      issuer: 'Backend', //@TODO: move to var
    });

    return secret;
  }

  static verify2FAToken(secret32, token, window = 1): boolean {
    // Verify a given token
    return speakeasy.totp.verify({
      window, // expiration on top of normal expiration
      token,
      secret: secret32,
      encoding: 'base32',
    });
  }

  static __generate2FAToken(secret32): boolean {
    // for testing
    return speakeasy.totp({
      secret: secret32,
      encoding: 'base32',
    });
  }

  static generate2FANumber(secretB32: string, counter: number): number {
    // Get a counter-based token
    return speakeasy.hotp({
      secret: secretB32,
      encoding: 'base32',
      counter,
    });
  }
  static verify2FANumber(secretB32: string, counter: number, token: string): boolean {
    return speakeasy.hotp.verify({
      secret: secretB32,
      encoding: 'base32',
      counter,
      token,
    });
  }
}
