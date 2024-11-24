// src/articles/articles.module.ts

import { Module } from '@nestjs/common';
import { PingPongService } from './pingPong.service';
import { PrismaModule } from './prisma.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
    controllers: [],
    providers: [PingPongService],
    imports: [PrismaModule],
    exports: [PingPongService],
})
export class PingPongModule {}
