import * as v from 'valibot';

const paginationSchema = v.object({
    limit: v.optional(
        v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50)),
    ),
    offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
});

const filterSchema = v.object({
    filter: v.optional(v.string()),
});

const sortingSchema = v.object({
    sort: v.optional(v.string()),
});

export const getAllQuerySchema = v.object({
    ...paginationSchema.entries,
    ...filterSchema.entries,
    ...sortingSchema.entries,
});

export class RequestParser {
    #request;
    #urlObject;
    #resource;
    #method;
    #params;

    constructor(request) {
        this.#request = request;
        this.#urlObject = new URL(request.url, 'http://localhost:3000');

        this.#parseMethod();
        this.#parseResource();
        this.#parseParams();

        console.log(this.#method, this.#resource, this.#params);
    }

    #parseMethod() {
        this.#method = this.#request.method;
    }

    #parseParams() {
        const pathname = this.#urlObject.pathname;
        const lastSlashIndex = pathname.lastIndexOf('/');

        const pathParams =
            lastSlashIndex === 0
                ? null
                : {
                      id: Number(pathname.slice(lastSlashIndex + 1)),
                  };

        const queryParams = v.safeParse(getAllQuerySchema, [
            ...this.#urlObject.searchParams.entries(),
        ]);

        this.#params = {
            pathParams,
            queryParams,
        };
    }

    #parseResource() {
        const pathname = this.#urlObject.pathname;
        const lastSlashIndex = pathname.lastIndexOf('/');

        this.#resource =
            lastSlashIndex === 0
                ? pathname
                : pathname.substring(0, lastSlashIndex);
    }

    #parseBody() {
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

    toObject() {
        const base = {
            resource: this.#resource,
            method: this.#method,
            params: this.#params,
        };

        if (this.#method === 'GET' || this.#method === 'DELETE') {
            return base;
        }

        return this.#parseBody().then((payload) => ({
            ...base,
            payload,
        }));
    }
}
