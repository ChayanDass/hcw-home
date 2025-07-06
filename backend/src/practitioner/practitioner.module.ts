import { Module } from '@nestjs/common';
import { PractitionerService } from './practitioner.service';
import { PractitionerController } from './practitioner.controller';

@Module({
  providers: [PractitionerService],
  controllers: [PractitionerController]
})
export class PractitionerModule {}
