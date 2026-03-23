export default class Router {
    #routes;

    constructor() {
        this.#routes = new Map();
    }

    #notFound() {
        return {
            statusCode: 404,
            data: {
                error: 'Not Found',
            },
        };
    }

    handle(pattern) {
        const handler = this.#routes.get(JSON.stringify(pattern));

        if (!handler) {
            return this.#notFound;
        }

        return handler;
    }

    register(pattern, handler) {
        this.#routes.set(JSON.stringify(pattern), handler);
    }
}
