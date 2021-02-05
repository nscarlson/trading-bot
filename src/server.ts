import WebSocket from 'ws'
import { v1 as uuidv1 } from 'uuid'

const wss = new WebSocket.Server({ port: 8080 })

const constructMessagePayload = (message: Record<string, unknown>): string =>
    JSON.stringify(message)

const clients = new Map<string, WebSocket>()

interface ExtWebSocket extends WebSocket {
    clientId: string
}

wss.on('connection', (ws) => {
    const extWs = ws as ExtWebSocket
    const thisClientId = uuidv1()

    extWs.clientId = thisClientId

    clients.set(thisClientId, ws)

    clients.forEach((client) => {
        client.send(`client ${extWs.clientId} joined`)
    })

    console.log(`opening session for ${thisClientId}`)

    ws.on('message', (message: string) => {
        try {
            const parsedMessage = JSON.parse(message)

            console.log('parsedMessage:', parsedMessage)
        } catch (err) {
            console.error('Could not parse message payload')
            ws.send(constructMessagePayload({ error: 'hi' }))
        }
    })

    ws.on('upgrade', (request) => {
        // console.log('request:', request)
    })

    ws.on('close', () => {
        console.log(`closing session for ${thisClientId}`)
        clients.delete(thisClientId)

        console.log(`number of clients: ${clients.size}`)
    })

    ws.send('oh and this too!')
})
