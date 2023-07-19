import { Injectable } from "@nestjs/common";
import { type Database, InjectDrizzle } from "../drizzle";
import { cuid } from "@/utils/functions";
import { users } from "@/schemas";

@Injectable()
export class UsersService {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async createUser() {
    const id = cuid();

    await this.db.insert(users).values({ id }).execute();

    return { id };
  }

  async getUser(id: string) {
    const user = await this.db.query.users
      .findFirst({ where: (users, { eq }) => eq(users.id, id) })
      .execute();

    return user ? user : null;
  }
}
