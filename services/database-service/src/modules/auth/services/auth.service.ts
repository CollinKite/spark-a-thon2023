import { type Database, InjectDrizzle } from "@/modules/drizzle";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ValidateServer } from "../auth.service.types";

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
    @InjectDrizzle()
    private readonly db: Database,
  ) {}

  async validateServer({ username, password }: ValidateServer) {
    const SERVER_USER = this.config.get<string>("SERVER_USER");
    const SERVER_PASSWORD = this.config.get<string>("SERVER_PASSWORD");

    // check hashed password/username

    if (username !== SERVER_USER || password !== SERVER_PASSWORD)
      throw new UnauthorizedException("YOU ARE NOT ALLOWED HERE");

    //generate new tokens
    const { accessToken, refreshToken } = await this.generateTokens(username);

    return { accessToken, refreshToken };
  }

  //generate tokens here
  private async generateTokens(username: string) {
    Promise.all([]);

    return { accessToken: "", refreshToken: "" } as const;
  }
}
