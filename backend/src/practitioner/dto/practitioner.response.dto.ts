import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserSex, UserStatus } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
export class PractitionerResponseDto {


    @ApiProperty()
    termId: number;

    @ApiProperty()
    acceptedAt: Date;

    @ApiProperty()
    termVersion: number;

    @ApiProperty()
    temporaryAccount: boolean;

    @ApiProperty({ description: 'User ID' })
    id: number;

    @ApiProperty({ enum: UserRole, description: 'User role' })
    role: UserRole;

    @ApiProperty({ description: 'First name' })
    firstName: string;

    @ApiProperty({ description: 'Last name' })
    lastName: string;

    @ApiProperty({ description: 'Email address' })
    email: string;

    @Exclude()
    password: string;

    @ApiProperty({ description: 'Phone number', nullable: true })
    phoneNumber: string | null;

    @ApiProperty({ description: 'Country', nullable: true })
    country: string | null;

    @ApiProperty({ enum: UserSex, description: 'Gender', nullable: true })
    sex: UserSex | null;

    @ApiProperty({ enum: UserStatus, description: 'User status' })
    status: UserStatus;

    @ApiProperty({ description: 'Creation date' })
    createdAt: Date;

    @ApiProperty({ description: 'Last update date' })
    updatedAt: Date;

    // @ApiProperty({ type: [Number], description: 'Organisation IDs' })
    // @Expose()
    // organisationIds: number[];

    // @ApiProperty({ type: [Number], description: 'Group IDs', required: false })
    // @Expose()
    // groupIds?: number[];

    // @ApiProperty({ type: [Number], description: 'Language IDs', required: false })
    // @Expose()
    // languageIds?: number[];

    // @ApiProperty({ type: [Number], description: 'Speciality IDs', required: false })
    // @Expose()
    // specialityIds?: number[];

    constructor(partial: Partial<PractitionerResponseDto>) {
        Object.assign(this, partial);
    }
}
