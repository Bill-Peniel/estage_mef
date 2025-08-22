import { Module } from '@nestjs/common';
import { TuteursService } from './tuteurs.service';
import { TuteursController } from './tuteurs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TuteursController],
  providers: [TuteursService],
  exports: [TuteursService]
})
export class TuteursModule {} 