declare global {
  export namespace NodeJS {
    export interface ProcessEnv {

      NODE_ENV: "developement" | "production" | "docker"
      PG_HOST: string;
      PG_DATABASE: string;
      PG_USER: string;
      PG_PASSWORD: string;
      PG_PORT: 5432;
    }
  }
}