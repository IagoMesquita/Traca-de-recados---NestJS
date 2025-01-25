import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PaginationDTO {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limite: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number;
}