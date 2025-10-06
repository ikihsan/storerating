import { IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;
}

export class UpdateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;
}
