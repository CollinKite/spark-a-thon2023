import type { Token } from "@/utils/types";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "refresh_token") {
  constructor(
    @Inject(ConfigService)
    private readonly _config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _config.get<string>("RT_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Token) {
    const rt = req.headers.authorization.split(" ")[1];
    return {
      ...payload,
      rt,
    };
  }
}
