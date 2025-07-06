import { Body, Controller, Post } from '@nestjs/common';
import { PractitionerService } from './practitioner.service';
import { Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiResponseDto } from 'src/common/helpers/response/api-response.dto';
import { CustomLoggerService } from 'src/logger/logger.service';

@Controller('practitioner')
export class PractitionerController {

    constructor(private practitionerService: PractitionerService
        , private readonly logger: CustomLoggerService
    )
     {}

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
      this.logger.log(`Fetching practitioner with ID: ${id}`);
      const data= await this.practitionerService.getPractitionerById(id);
      this.logger.log(`Practitioner fetched successfully`);
      return ApiResponseDto.success({
        practitioner: data,
      }, 'Practitioner fetched successfully');
    }



      @Post('accept-term')
        async acceptTerms(@Body() body: { userId: number; termId: number }) {
            this.logger.log(`Accepting terms for practitionerId: ${body.userId}, termId: ${body.termId}`);
          const data = await this.practitionerService.acceptTerm(body.userId, body.termId);
          if (!data) {
            return ApiResponseDto.error('Failed to accept terms');
          }
        this.logger.log(`Terms accepted successfully for userId: ${body.userId}`);
          return ApiResponseDto.success(data, 'Terms accepted successfully', 200,);
        }
}
