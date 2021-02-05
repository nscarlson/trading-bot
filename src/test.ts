import WebSocket from 'ws'

const ws = new WebSocket('ws://localhost:8080/test')

const constructMessagePayload = (message: Record<string, unknown>): string =>
    JSON.stringify(message)

ws.on('open', function open() {
    ws.send(
        constructMessagePayload({
            message: 'hello there',
        }),
    )
})

ws.on('message', function incoming(data) {
    console.log('received message:')
    console.log(data)
})
