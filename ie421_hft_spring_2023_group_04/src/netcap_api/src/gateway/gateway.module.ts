import { Module } from '@nestjs/common';
import { LiveDataGateway } from './gateway';
import { RawPCAPModule } from 'src/rawpcap.module';

@Module({
    imports: [RawPCAPModule],
    providers: [LiveDataGateway],
    exports: [LiveDataGateway],
})
export class GatewayModule {}
