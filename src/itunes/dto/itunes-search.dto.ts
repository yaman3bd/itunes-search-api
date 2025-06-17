import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ItunesSearchDto {
  @IsString()
  @IsNotEmpty()
  term: string;
  @IsString()
  @IsOptional()
  limit?: string;
  @IsString()
  @IsOptional()
  media?: string;
  @IsString()
  @IsOptional()
  page?: string;
}
