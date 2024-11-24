// src/articles/articles.module.ts

import { Module } from '@nestjs/common';
import { RawPCAPService } from './rawpcap.service';
import { PrismaModule } from './prisma.module';

@Module({
    controllers: [],
    providers: [RawPCAPService],
    imports: [PrismaModule],
    exports: [RawPCAPService],
})
export class RawPCAPModule {}
