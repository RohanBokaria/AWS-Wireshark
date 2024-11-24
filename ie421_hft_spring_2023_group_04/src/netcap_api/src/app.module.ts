import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PingPongModule } from './pingPong.module';
import { PingPongService } from './pingPong.service';
import { NodeModule } from './node.module';
import { NodeService } from './node.service';
import { RawPCAPService } from './rawpcap.service';
import { RawPCAPModule } from './rawpcap.module';
import { PrismaModule } from './prisma.module';
import { RequestsService } from './requests.service';
import { RequestsModule } from './requests.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
    imports: [
        PrismaModule,
        PingPongModule,
        NodeModule,
        RawPCAPModule,
        RequestsModule,
        GatewayModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        PingPongService,
        NodeService,
        RawPCAPService,
        RequestsService,
    ],
})
export class AppModule {}
