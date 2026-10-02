import { resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // .env unique à la racine du monorepo, quel que soit le cwd (src/ et dist/ ont la même profondeur).
    // Confort de dev : en production, les variables sont injectées dans l'environnement.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(__dirname, '../../../.env')],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
