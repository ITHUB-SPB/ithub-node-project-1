import { createServer } from 'node:http'
import Router from './router.js'
import { BookingController } from './controller.js'

const router = new Router()

router.register({ method: "GET", path: "/bookings" }, BookingController.findAll)
router.register({ method: "POST", path: "/bookings" }, BookingController.create)

const server = createServer((request, response) => {
    const headers = {
        "Content-Type": "application/json"
    }

    const method = request.method
    const path = request.url

    if (method === 'GET' || method === 'DELETE') {
        const { statusCode, data } = router.handle({ method, path })()

        response.writeHead(statusCode, undefined, headers)
        response.end(JSON.stringify(data))
        return
    }

    let payload = ''

    request.on("data", chunk => {
        payload += chunk.toString()
    })

    request.on("end", () => {
        console.log('payload', payload)
        const { statusCode, data } = router.handle({ method, path })(payload)
        response.writeHead(statusCode, undefined, headers)
        response.end(JSON.stringify(data))
    })
})

server.listen(3000, () => {
    console.log(`API server listening: http://localhost:3000`)
})