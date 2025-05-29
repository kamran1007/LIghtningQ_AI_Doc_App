// dto/change-password.dto.ts
import { IsString, Matches, MinLength } from 'class-validator';

// export class ChangePasswordDto {
//   @IsString()
//   currentPassword!: string;

//   @IsString()
//   newPassword!: string;
// }

export class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: 'Old password is required' })
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  @Matches(/[A-Z]/, { message: 'New password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'New password must contain at least one lowercase letter' })
  @Matches(/[0-9]/, { message: 'New password must contain at least one number' })
  @Matches(/[\W_]/, { message: 'New password must contain at least one special character' })
  newPassword!: string;
}
