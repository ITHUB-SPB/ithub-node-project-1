type RouteHandler = (...args: unknown[]) => unknown;

type RouteEntry = {
  pattern: string;
  handler: RouteHandler;
  segments: string[];
};

type RouterParams = {
  pathParams: Record<string, number> | null;
  queryParams: Record<string, string>;
};

type RouteResult = {
  handler: RouteHandler | null;
  params: RouterParams;
  statusCode: number;
};

export class Router {
  private routes: Record<string, RouteEntry[]> = {};

  register(method: string, pattern: string, handler: RouteHandler) {
    const normalizedMethod = method.toUpperCase();
    const segments = this.normalizePath(pattern).split("/").filter(Boolean);

    if (!this.routes[normalizedMethod]) {
      this.routes[normalizedMethod] = [];
    }

    const existing = this.routes[normalizedMethod].find(
      (route) => route.pattern === pattern,
    );

    if (existing) {
      existing.handler = handler;
      return;
    }

    this.routes[normalizedMethod].push({ pattern, handler, segments });
  }

  route(method: string, url: string): RouteResult {
    const normalizedMethod = method.toUpperCase();
    const [pathname = ""] = url.split("?");
    const requestSegments = this.normalizePath(pathname)
      .split("/")
      .filter(Boolean);
    const queryParams = this.parseQuery(url);

    const handlers = this.routes[normalizedMethod] ?? [];

    for (const route of handlers) {
      const params = this.matchRoute(route.segments, requestSegments);
      if (params) {
        return {
          handler: route.handler,
          params: {
            pathParams: Object.keys(params).length ? params : null,
            queryParams,
          },
          statusCode: 200,
        };
      }
    }

    return {
      handler: null,
      params: { pathParams: null, queryParams },
      statusCode: 404,
    };
  }

  private normalizePath(path: string): string {
    return path.replace(/\/\/+$/, "");
  }

  private parseQuery(url: string): Record<string, string> {
    const queryString = url.includes("?") ? url.split("?")[1] : "";
    const result: Record<string, string> = {};
    const searchParams = new URLSearchParams(queryString);

    for (const [key, value] of searchParams.entries()) {
      result[key] = value;
    }

    return result;
  }

  private matchRoute(
    patternSegments: string[],
    requestSegments: string[],
  ): Record<string, number> | null {
    if (patternSegments.length !== requestSegments.length) {
      return null;
    }

    const params: Record<string, number> = {};

    for (let i = 0; i < patternSegments.length; i += 1) {
      const patternSegment = patternSegments[i];
      const requestSegment = requestSegments[i];

      if (patternSegment && patternSegment.startsWith(":")) {
        const paramName = patternSegment.slice(1);
        const value = Number(requestSegment);
        if (Number.isNaN(value)) {
          return null;
        }
        params[paramName] = value;
        continue;
      }

      if (patternSegment !== requestSegment) {
        return null;
      }
    }

    return params;
  }
}
