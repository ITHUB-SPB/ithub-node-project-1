import type { ParserOutput } from "./schema.js";

type Pattern = Omit<Awaited<ParserOutput>, "params" | "payload">;
type HandlerParams = Pick<Awaited<ParserOutput>, "params" | "payload">;

type Handler = ({ params, payload } : HandlerParams) => { 
    statusCode: number,
    data: object
}


export default class Router {
  #routes;

  constructor() {
    this.#routes = new Map();
  }

  #notFound() {
    return {
      statusCode: 404,
      data: {
        error: "Not Found",
      },
    };
  }

  handle(pattern: Pattern) {
    const handler = this.#routes.get(JSON.stringify(pattern));

    if (!handler) {
      return this.#notFound;
    }

    return handler;
  }

  register(pattern: Pattern, handler: Handler) {
    this.#routes.set(JSON.stringify(pattern), handler);
  }
}