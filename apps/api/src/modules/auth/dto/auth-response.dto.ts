import { ApiProperty } from "@nestjs/swagger";

export class AuthUserDto {
  @ApiProperty({ description: "User ID", example: "uuid" })
  id!: string;

  @ApiProperty({ description: "User email", example: "user@example.com" })
  email!: string;

  @ApiProperty({ description: "User display name", example: "John Doe", nullable: true })
  name!: string | null;
}

export class AuthResponseDto {
  @ApiProperty({ description: "JWT access token", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  accessToken!: string;

  @ApiProperty({ description: "JWT refresh token", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  refreshToken!: string;

  @ApiProperty({ description: "Authenticated user", type: AuthUserDto })
  user!: AuthUserDto;
}
