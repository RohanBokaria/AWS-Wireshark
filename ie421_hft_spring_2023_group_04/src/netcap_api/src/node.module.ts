// src/articles/articles.module.ts

import { Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { PrismaModule } from './prisma.module';

@Module({
    controllers: [],
    providers: [NodeService],
    imports: [PrismaModule],
})
export class NodeModule {}
