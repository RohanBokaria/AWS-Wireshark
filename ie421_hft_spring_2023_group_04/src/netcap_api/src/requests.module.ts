import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { PrismaModule } from './prisma.module';

@Module({
    controllers: [],
    providers: [RequestsService],
    imports: [PrismaModule],
    exports: [RequestsService],
})
export class RequestsModule {}
