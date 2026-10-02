import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // .env unique à la racine du monorepo (cwd = apps/api avec pnpm --filter)
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
