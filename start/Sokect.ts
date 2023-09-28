import { socketController } from "App/Controllers/Socket/SocketController";
import WebSocket from "App/Services/WebSocket";

WebSocket.boot()
WebSocket.io.on('connection',socketController)
