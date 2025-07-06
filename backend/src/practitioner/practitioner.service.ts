import { Injectable } from '@nestjs/common';
import { HttpExceptionHelper } from 'src/common/helpers/execption/http-exception.helper';
import { DatabaseService } from 'src/database/database.service';
import { PractitionerResponseDto } from './dto/practitioner.response.dto';
import { plainToInstance } from 'class-transformer';
import { log } from 'console';
import { CustomLoggerService } from 'src/logger/logger.service';

@Injectable()
export class PractitionerService {
  constructor(private readonly prisma: DatabaseService
    , private readonly logger: CustomLoggerService
  ) {}

  async getPractitionerById(userId: number): Promise<PractitionerResponseDto> {
    const practitioner = await this.prisma.practitioner.findUnique({
      where: { id: userId },
      include: {
        user: true,
      },
    });

    if (!practitioner) {
      throw HttpExceptionHelper.notFound(`Practitioner with userId ${userId} not found`);
    }
    const { user, ...rest } = practitioner;
    const response: PractitionerResponseDto = {
      ...rest,
      ...user, // Flatten user fields directly into response
      
    };
    // Convert to PractitionerResponseDto instance
    Object.assign(response, plainToInstance(PractitionerResponseDto, response));
    return response;
  }



  /**
   * Accepts terms for a practitioner.
   * If the practitioner already exists, updates the termsId and acceptedAt.
   * If not, creates a new practitioner record.
   *
   * @param userId - The ID of the user accepting the terms.
   * @param termId - The ID of the terms being accepted.
   * @returns The updated or created practitioner record.
   */
  async acceptTerm(practitionerId: number, termId: number) {
    // Fetch the new terms
    const newTerm = await this.prisma.terms.findUnique({
      where: { id: termId },
    });
  
    if (!newTerm) {
      throw HttpExceptionHelper.notFound('Terms not found');
    }
  
    // Check if practitioner already exists
    const existing = await this.prisma.practitioner.findUnique({
      where: { id: practitionerId },
    });
  
    if (existing) {
      // Only update if version is newer
      if (newTerm.version <= existing.termVersion ) {
        throw HttpExceptionHelper.badRequest(
          `Practitioner has already accepted terms version ${existing.termVersion}`
        );
      }
  
      // Update existing practitioner with new terms
      return await this.prisma.practitioner.update({
        where: { id: practitionerId },
        data: {
          termId,
          termVersion: newTerm.version,
          acceptedAt: new Date(),
        },
      });
  
    }
  
    // Create new practitioner record
   return await this.prisma.practitioner.create({
      data: {
        id: practitionerId,
        termId,
        termVersion: newTerm.version,
      },
    });
  
  }
  
}