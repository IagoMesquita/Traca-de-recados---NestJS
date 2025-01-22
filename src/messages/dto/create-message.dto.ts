import { IsNotEmpty, IsString } from "@nestjs/class-validator";
import { MaxLength, MinLength } from "class-validator";

export class CreateMessageDto {
  
  @IsString({ message: "Texto deve ser uma string"})
  @IsNotEmpty({ message: "Texto nao pode ser vazio"})
  @MinLength(10, {message: "Texto deve ter no minimo 7 caracteres"})
  @MaxLength(100, {message: "Texto deve ter no maximo 100 caracteres"})
  readonly text: string;

  @IsString()
  @IsNotEmpty()
  readonly from: string;

  @IsString()
  @IsNotEmpty()
  readonly to: string;
}


