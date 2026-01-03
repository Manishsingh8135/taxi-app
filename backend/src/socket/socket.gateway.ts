import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger = new Logger('SocketGateway');

  constructor(private socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.setServer(server);
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.socketService.handleDisconnect(client.id);
  }

  @SubscribeMessage('ride:subscribe')
  handleRideSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { rideId: string },
  ) {
    client.join(`ride:${data.rideId}`);
    this.logger.log(`Client ${client.id} subscribed to ride ${data.rideId}`);
  }

  @SubscribeMessage('ride:unsubscribe')
  handleRideUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { rideId: string },
  ) {
    client.leave(`ride:${data.rideId}`);
    this.logger.log(`Client ${client.id} unsubscribed from ride ${data.rideId}`);
  }

  @SubscribeMessage('driver:location_update')
  handleDriverLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      latitude: number;
      longitude: number;
      heading?: number;
      speed?: number;
    },
  ) {
    this.socketService.updateDriverLocation(client.id, data);
  }

  @SubscribeMessage('driver:ride_response')
  handleDriverRideResponse(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { rideId: string; accepted: boolean },
  ) {
    this.socketService.handleDriverRideResponse(client.id, data);
  }
}
