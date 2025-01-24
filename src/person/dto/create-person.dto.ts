import { IsEmail } from "@nestjs/class-validator";
import { IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreatePersonDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
