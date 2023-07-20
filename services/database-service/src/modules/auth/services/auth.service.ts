import { type Database, InjectDrizzle } from "@/modules/drizzle";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { compare } from "bcryptjs";
import { ValidateServer } from "../auth.service.types";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @InjectDrizzle()
    private readonly db: Database,
  ) {}

  async validateServer({ username, password }: ValidateServer) {
    if (!(await this.validateCredentials(username, password)))
      throw new UnauthorizedException("YOU ARE NOT ALLOWED HERE");

    const { accessToken, refreshToken } = await this.generateTokens(username);

    return { accessToken, refreshToken };
  }

  private async validateCredentials(username: string, password: string) {
    const SERVER_USER = this.config.get<string>("SERVER_USERNAME");
    const SERVER_PASSWORD = this.config.get<string>("SERVER_PASSWORD");

    return (
      (await compare(username, SERVER_USER)) &&
      (await compare(password, SERVER_PASSWORD))
    );
  }

  //generate tokens here
  private async generateTokens(username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { username },
        { expiresIn: "1h", secret: this.config.get<string>("AT_SECRET") },
      ),
      this.jwtService.signAsync(
        { username },
        { expiresIn: "30d", secret: this.config.get<string>("RT_SECRET") },
      ),
    ]);

    return { accessToken, refreshToken } as const;
  }
}
