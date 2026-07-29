import { ApiProperty } from "@nestjs/swagger";

export class UserProfileDto {
  @ApiProperty({ description: "User ID", example: "uuid" })
  id!: string;

  @ApiProperty({ description: "User email", example: "user@example.com" })
  email!: string;

  @ApiProperty({ description: "User display name", example: "John Doe", nullable: true })
  name!: string | null;

  @ApiProperty({ description: "Account creation date", example: "2025-01-15T10:30:00.000Z" })
  createdAt!: Date;
}
