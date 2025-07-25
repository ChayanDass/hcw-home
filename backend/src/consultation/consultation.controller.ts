import {
  Body,
  Controller,
  Get,
  Header,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import {
  JoinConsultationDto,
  JoinConsultationResponseDto,
} from './dto/join-consultation.dto';
import { UserIdParamPipe } from './validation/user-id-param.pipe';
import { ConsultationIdParamPipe } from './validation/consultation-id-param.pipe';
import { ApiResponseDto } from 'src/common/helpers/response/api-response.dto';
import { WaitingRoomPreviewResponseDto } from './dto/waiting-room-preview.dto';
import {
  AdmitPatientDto,
  AdmitPatientResponseDto,
} from './dto/admit-patient.dto';
import {
  CreateConsultationDto,
  CreateConsultationWithTimeSlotDto,
  ConsultationResponseDto,
} from './dto/create-consultation.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { HistoryQueryDto } from './dto/history-query.dto';
import { ConsultationHistoryItemDto } from './dto/consultation-history-item.dto';
import { ConsultationDetailDto } from './dto/consultation-detail.dto';
import { Response } from 'express';
import {
  EndConsultationDto,
  EndConsultationResponseDto,
} from './dto/end-consultation.dto';
import { ConsultationPatientHistoryItemDto } from './dto/consultation-patient-history.dto';
import { RateConsultationDto } from './dto/rate-consultation.dto';
import { CloseConsultationDto } from './dto/close-consultation.dto';
import { JoinOpenConsultationDto } from './dto/join-open-consultation.dto';
import {
  OpenConsultationResponseDto,
  OpenConsultationQueryDto,
} from './dto/open-consultation.dto';
import { ResponseStatus } from 'src/common/helpers/response/response-status.enum';

@ApiTags('consultation')
@Controller('consultation')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new consultation (practitioner/admin only)',
  })
  @ApiBody({ type: CreateConsultationDto })
  @ApiCreatedResponse({
    description: 'Consultation created',
    type: ApiResponseDto<ConsultationResponseDto>,
  })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  async createConsultation(
    @Body() createDto: CreateConsultationDto,
    @Query('userId', UserIdParamPipe) userId: number,
  ): Promise<any> {
    const result = await this.consultationService.createConsultation(
      createDto,
      userId,
    );
    return {
      ...ApiResponseDto.success(result.data, result.message, result.statusCode),
      timestamp: new Date().toISOString(),
    };
  }

  @Post('with-timeslot')
  @ApiOperation({
    summary: 'Create a new consultation with time slot booking',
  })
  @ApiBody({ type: CreateConsultationWithTimeSlotDto })
  @ApiCreatedResponse({
    description: 'Consultation created with time slot booked',
    type: ApiResponseDto<ConsultationResponseDto>,
  })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  async createConsultationWithTimeSlot(
    @Body() createDto: CreateConsultationWithTimeSlotDto,
    @Query('userId', UserIdParamPipe) userId: number,
  ): Promise<any> {
    const result =
      await this.consultationService.createConsultationWithTimeSlot(
        createDto,
        userId,
      );
    return {
      ...ApiResponseDto.success(result.data, result.message, result.statusCode),
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/join/patient')
  @ApiOperation({ summary: 'Patient joins a consultation' })
  @ApiParam({ name: 'id', type: Number, description: 'Consultation ID' })
  @ApiBody({ type: JoinConsultationDto })
  @ApiOkResponse({
    description: 'Patient joined consultation',
    type: ApiResponseDto<JoinConsultationResponseDto>,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async joinPatient(
    @Param('id', ConsultationIdParamPipe) id: number,
    @Body() body: JoinConsultationDto,
  ): Promise<any> {
    const result = await this.consultationService.joinAsPatient(
      id,
      body.userId,
    );
    return {
      ...result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/join/practitioner')
  @ApiOperation({ summary: 'Practitioner joins a consultation' })
  @ApiParam({ name: 'id', type: Number, description: 'Consultation ID' })
  @ApiBody({ type: JoinConsultationDto })
  @ApiOkResponse({
    description: 'Practitioner joined consultation',
    type: ApiResponseDto<JoinConsultationResponseDto>,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async joinPractitioner(
    @Param('id', ConsultationIdParamPipe) id: number,
    @Body() body: JoinConsultationDto,
  ): Promise<any> {
    const result = await this.consultationService.joinAsPractitioner(
      id,
      body.userId,
    );
    return {
      ...result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('/admit')
  @ApiOperation({
    summary: 'Admit a patient to a consultation (practitioner or admin only)',
  })
  @ApiBody({ type: AdmitPatientDto })
  @ApiOkResponse({
    description: 'Patient admitted to consultation',
    type: ApiResponseDto<AdmitPatientResponseDto>,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async admitPatient(
    @Body() dto: AdmitPatientDto,
    @Query('userId', UserIdParamPipe) userId: number,
  ): Promise<any> {
    const result = await this.consultationService.admitPatient(dto, userId);
    return {
      ...result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('/end')
  @ApiOperation({ summary: 'End a consultation (practitioner or admin only)' })
  @ApiBody({ type: EndConsultationDto })
  @ApiOkResponse({
    description: 'Consultation ended',
    type: ApiResponseDto<EndConsultationResponseDto>,
  })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  async endConsultation(
    @Body() endDto: EndConsultationDto,
    @Query('userId', UserIdParamPipe) userId: number,
  ): Promise<any> {
    const result = await this.consultationService.endConsultation(
      endDto,
      userId,
    );
    return {
      ...result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/waiting-room')
  @ApiOperation({
    summary: 'Get waiting room consultations for a practitioner',
  })
  @ApiQuery({ name: 'userId', type: Number, description: 'Practitioner ID' })
  @ApiOkResponse({
    description: 'Waiting room consultations',
    type: ApiResponseDto<WaitingRoomPreviewResponseDto>,
  })
  async getWaitingRoom(
    @Query('userId', UserIdParamPipe) userId: number,
  ): Promise<any> {
    const result =
      await this.consultationService.getWaitingRoomConsultations(userId);
    return {
      ...result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/history')
  @ApiOperation({ summary: 'Fetch consultation history for a practitioner' })
  @ApiQuery({
    name: 'practitionerId',
    type: Number,
    description: 'Practitioner ID',
  })
  @ApiQuery({
    name: 'status',
    enum: ['COMPLETED', 'TERMINATED_OPEN'],
    required: false,
  })
  @ApiOkResponse({ type: ApiResponseDto<ConsultationHistoryItemDto[]> })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async getHistory(@Query() query: HistoryQueryDto): Promise<any> {
    const result = await this.consultationService.getConsultationHistory(
      query.practitionerId,
      query.status,
    );
    return {
      ...ApiResponseDto.success(
        result,
        'Consultation history fetched successfully',
        HttpStatus.OK,
      ),
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Fetch full details of one consultation' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: ApiResponseDto<ConsultationDetailDto> })
  async getDetails(
    @Param('id', ConsultationIdParamPipe) id: number,
  ): Promise<any> {
    const result = await this.consultationService.getConsultationDetails(id);
    return {
      ...ApiResponseDto.success(
        result,
        'Consultation details fetched successfully',
        HttpStatus.OK,
      ),
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Download consultation PDF' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({
    name: 'requesterId',
    type: Number,
    description: 'ID of requesting user',
  })
  @Header('Content-Type', 'application/pdf')
  async downloadPdf(
    @Param('id', ConsultationIdParamPipe) id: number,
    @Query('requesterId', ParseIntPipe) requesterId: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.consultationService.downloadConsultationPdf(
      id,
      requesterId,
    );
    res
      .status(HttpStatus.OK)
      .set({
        'Content-Disposition': `attachment; filename="consultation_${id}.pdf"`,
      })
      .send(pdfBuffer);
  }

  @Get('/patient/history')
  @ApiOperation({ summary: 'Fetch consultation history for a patient' })
  @ApiQuery({
    name: 'patientId',
    type: Number,
    description: 'Patient ID',
  })
  @ApiOkResponse({ type: ApiResponseDto<ConsultationPatientHistoryItemDto[]> })
  async getPatientHistory(
    @Query('patientId', UserIdParamPipe) patientId: number,
  ): Promise<any> {
    const consultations =
      await this.consultationService.getPatientConsultationHistory(patientId);
    return {
      ...ApiResponseDto.success(
        consultations,
        'Patient consultation history fetched successfully',
        HttpStatus.OK,
      ),
      timestamp: new Date().toISOString(),
    };
  }

  @Post('/patient/rate')
  @ApiOperation({ summary: 'Patient rates a completed consultation' })
  @ApiBody({ type: RateConsultationDto })
  @ApiOkResponse({ type: ApiResponseDto })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  async rateConsultation(
    @Query('patientId', UserIdParamPipe) patientId: number,
    @Body() dto: RateConsultationDto,
  ): Promise<any> {
    const result = await this.consultationService.rateConsultation(
      patientId,
      dto,
    );
    return {
      ...result,
      timestamp: new Date().toISOString(),
    };
  }
  @Get('/open')
  @ApiOperation({
    summary: 'Get all open (ongoing) consultations for a practitioner',
  })
  @ApiQuery({
    name: 'practitionerId',
    type: Number,
    description: 'Practitioner ID',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Items per page (default: 10)',
  })
  @ApiOkResponse({
    description: 'Open consultations fetched successfully',
    type: ApiResponseDto<OpenConsultationResponseDto>,
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async getOpenConsultations(
    @Query('practitionerId', UserIdParamPipe) practitionerId: number,
    @Query() query: OpenConsultationQueryDto,
  ): Promise<ApiResponseDto<OpenConsultationResponseDto>> {
    return this.consultationService.getOpenConsultations(
      practitionerId,
      query.page,
      query.limit,
    );
  }

  @Post('/open/join')
  @ApiOperation({
    summary: 'Join an open consultation (rejoins existing session)',
  })
  @ApiBody({ type: JoinOpenConsultationDto })
  @ApiOkResponse({
    description: 'Successfully rejoined consultation',
    type: ApiResponseDto<JoinConsultationResponseDto>,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async joinOpenConsultation(
    @Body() dto: JoinOpenConsultationDto,
    @Query('practitionerId', UserIdParamPipe) practitionerId: number,
  ): Promise<ApiResponseDto<JoinConsultationResponseDto>> {
    return this.consultationService.joinAsPractitioner(
      dto.consultationId,
      practitionerId,
    );
  }
  @Post('/open/close')
  @ApiOperation({
    summary: 'Close an open consultation - Deprecated: Use /consultation/end',
    deprecated: true,
  })
  @ApiBody({ type: CloseConsultationDto })
  @ApiOkResponse({
    description: 'Consultation closed successfully',
    type: ApiResponseDto<EndConsultationResponseDto>,
  })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async closeConsultation(
    @Body() dto: CloseConsultationDto,
    @Query('practitionerId', UserIdParamPipe) practitionerId: number,
  ): Promise<ApiResponseDto<EndConsultationResponseDto>> {
    const endDto: EndConsultationDto = {
      consultationId: dto.consultationId,
      action: 'close',
      reason: dto.reason,
    };

    return this.consultationService.endConsultation(endDto, practitionerId);
  }

  @Get('/open/:id/details')
  @ApiOperation({
    summary: 'Get detailed information about an open consultation',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Consultation ID',
  })
  @ApiOkResponse({
    description: 'Open consultation details fetched successfully',
    type: ApiResponseDto<ConsultationDetailDto>,
  })
  async getOpenConsultationDetails(
    @Param('id', ConsultationIdParamPipe) id: number,
    @Query('practitionerId', UserIdParamPipe) practitionerId: number,
  ): Promise<ApiResponseDto<ConsultationDetailDto>> {
    // Use the service method to verify access and get details
    const data = await this.consultationService.getOpenConsultationDetails(
      id,
      practitionerId,
    );

    return {
      success: true,
      status: ResponseStatus.SUCCESS,
      statusCode: HttpStatus.OK,
      message: 'Open consultation details fetched successfully',
      timestamp: new Date().toISOString(),
      data,
    };
  }
}
