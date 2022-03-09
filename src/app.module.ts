import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SwController } from './swservice/sw.controller';
import { swService } from './swservice/sw.service';

@Module({
  imports: [],
  controllers: [AppController, SwController],
  providers: [AppService, swService],
})
export class AppModule { }
