type RequestParams = {
  pathParams: { id: number } | null;
  queryParams: Record<string, string>;
};

type RequestParseResult = {
  method: string;
  resource: string;
  payload: unknown | null;
  params: RequestParams;
};

export class RequestParser {
  parse(
    method: string,
    url: string,
    body: unknown,
    _headers: Record<string, unknown>,
  ): RequestParseResult {
    const [pathname = "", queryString] = url.split("?");
    const pathSegments = pathname
      .replace(/\/\/+$/, "")
      .split("/")
      .filter(Boolean);

    const pathParams = this.parsePathParams(pathSegments);
    const resource = this.normalizeResource(pathSegments);
    const queryParams = this.parseQuery(queryString);
    const payload = method === "POST" ? body : null;

    return {
      method,
      resource,
      payload,
      params: {
        pathParams,
        queryParams,
      },
    };
  }

  private normalizeResource(pathSegments: string[]): string {
    if (pathSegments.length < 2) {
      return "/";
    }

    if (pathSegments[0] === "api") {
      return `/${pathSegments[1]}`;
    }

    return `/${pathSegments[0]}`;
  }

  private parsePathParams(pathSegments: string[]) {
    if (pathSegments.length !== 3 || pathSegments[0] !== "api") {
      return null;
    }

    const id = Number(pathSegments[2]);
    if (Number.isNaN(id)) {
      return null;
    }

    return {
      id,
    };
  }

  private parseQuery(queryString: string | undefined): Record<string, string> {
    const result: Record<string, string> = {};

    if (!queryString) {
      return result;
    }

    const searchParams = new URLSearchParams(queryString);
    for (const [key, value] of searchParams.entries()) {
      result[key] = value;
    }

    return result;
  }
}
