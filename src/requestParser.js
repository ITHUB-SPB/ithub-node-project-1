export class RequestParser {
    #resource;
    #method;
    #params;
    #body;

    constructor(request) {
        const urlObject = new URL(request.url, 'http://localhost:3000')
        this.#method = request.method
        this.#resource = this.#parseResource(urlObject)
        // this.#parseBody(request)
        this.#params = this.#parseParams(urlObject)
        console.log(this.#method, this.#resource, this.#params)
    }

    #parseParams(urlObject) {
        // разобрать и вернуть согласно примеру ниже
        // 1. параметры пути на основе urlObject.pathname (0.5 балла)
        // 2. поисковые параметры на основе urlObject.searchParams (по 0.5 за каждый из четырех)
        // 
        // бонус (1 балл): настройки пагинации выдавать в цельном объекте paginate
        // бонус (1 балл): добавить валидацию на основе valibot-схемы (добавить в schema.js)

        const pathname = urlObject.pathname
        const lastSlashIndex = pathname.lastIndexOf('/')

        return {
            pathParams: lastSlashIndex === 0 ? null : {
                id: Number(pathname.slice(lastSlashIndex + 1))
            }
        }

        // return {
        //     pathParams: { id: 1 }, // или же null, если их нет
        //     queryParams: {
        //         filter: 'end.eq.1000000', // или же null, если его нет,
        //         sort: 'start.asc', // или же null, если его нет,
        //         limit: 10, // или же null, если его нет,
        //         offset: 0 // или же null, если его нет,
        //     } //
        // }
    }

    #parseResource(urlObject) {
        // возвращать ресурс (0.5 балла)
        // (из адреса http://localhost:3000/bookings возвращать /bookings)
        // (из адреса http://localhost:3000/bookings/1 возвращать /bookings)
        // (из адреса http://localhost:3000/bookings?sort=start.desc возвращать /bookings)
        const pathname = urlObject.pathname
        const lastSlashIndex = pathname.lastIndexOf('/')

        return lastSlashIndex === 0 ? pathname : pathname.substring(0, lastSlashIndex)
    }

    #parseBody(request) {
        // базовое задание (2 балла):
        // проверить, успевает ли считаться тело перед тем, как мы вернем ответ
        // если нет, вспомнить промисы и сделать соответствующий then,
        // либо (если промисы сложны) встроить ожидание в коллбэк
        // бонус (2 балла): за промисификацию request.on('data') и request.on('end')

        let payload = ''

        request.on("data", chunk => {
            payload += chunk.toString()
        })

        request.on("end", () => {
            this.#body = payload
        })
    }

    toObject() {
        return {
            resource: this.#resource,
            method: this.#method,
            params: this.#params,
            payload: this.#body
        }
    }
}