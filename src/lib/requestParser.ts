import type { IncomingMessage } from 'node:http';
import * as v from 'valibot';
import * as schema from './schema.js';

export class RequestParser {
    #request;
    #urlObject;
    #resource: schema.Resource;
    #method: schema.Method;
    #params: schema.Params;

    constructor(request: IncomingMessage) {
        this.#request = request;
        this.#urlObject = new URL(request.url!, 'http://localhost:3000');

        this.#method = this.#parseMethod();
        this.#resource = this.#parseResource();
        this.#params = this.#parseParams();

        console.log(this.#method, this.#resource, this.#params);
    }

    #parseMethod() {
        return v.parse(schema.methodSchema, this.#request);
    }

    #parseParams() {
        const pathname = this.#urlObject.pathname;
        const lastSlashIndex = pathname.lastIndexOf('/');

        const pathParams = v.parse(
            schema.pathParamsSchema,
            lastSlashIndex === 0
                ? null
                : {
                      id: Number(pathname.slice(lastSlashIndex + 1)),
                  },
        );

        const queryParams = v.parse(schema.queryParamsSchema, [
            ...this.#urlObject.searchParams.entries(),
        ]);

        return {
            pathParams,
            queryParams,
        };
    }

    #parseResource() {
        const pathname = this.#urlObject.pathname;
        const lastSlashIndex = pathname.lastIndexOf('/');

        const resource =
            lastSlashIndex === 0
                ? pathname
                : pathname.substring(0, lastSlashIndex);

        return v.parse(schema.resourceSchema, resource);
    }

    #parseBody(): Promise<string> {
        return new Promise((resolve, reject) => {
            let payload = '';

            this.#request.on('data', (chunk) => {
                payload += chunk.toString();
            });

            this.#request.on('error', (error) => {
                reject(error);
            });

            this.#request.on('end', () => {
                resolve(payload);
            });
        });
    }

    async toObject(): schema.ParserOutput {
        const base = {
            resource: this.#resource,
            method: this.#method,
            params: this.#params,
            payload: null,
        };

        if (this.#method === 'GET' || this.#method === 'DELETE') {
            return base;
        }

        return this.#parseBody()
            .then(JSON.parse)
            .then((payload) => ({
                ...base,
                payload,
            }));
    }
}
