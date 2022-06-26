import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UserService,
    private readonly config: ConfigService,
  ) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && (req.cookies || req.signedCookies)) {
        token = req.cookies['token'] || req.signedCookies['token'];
      }
      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };
    console.log('the extraction', extractJwtFromCookie);
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      passReqToCallback: false,
      secretOrKey: config.get<string>('SECRET'),
    });
  }

  extractJwtFromCookie(req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    return token;
  }

  async validate(payload: { username: string; sub: string }, done) {
    const user = await this.usersService.findOne(payload.username, true);
    if (!user) {
      throw new UnauthorizedException();
    }

    delete user.password;
    done(null, user);
  }
}
