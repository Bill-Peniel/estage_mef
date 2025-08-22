import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3002/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
      scope: ['email'],
      passReqToCallback: false
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    const { name, emails, photos, id } = profile;
    const user = {
      provider: 'facebook',
      providerId: id,
      email: emails && emails[0] ? emails[0].value : null,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos && photos[0] ? photos[0].value : null
    };
    done(null, user);
  }
} 