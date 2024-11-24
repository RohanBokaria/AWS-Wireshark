import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(3000);
}
bootstrap();

(BigInt.prototype as any).toJSON = function () {
    return Number(this);
};
