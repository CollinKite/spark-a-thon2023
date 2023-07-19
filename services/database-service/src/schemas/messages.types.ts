type From = "user" | "AI";
export type Messages = Array<{
  content: string;
  from: From;
}>;
