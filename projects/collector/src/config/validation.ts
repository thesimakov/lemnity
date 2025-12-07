import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsNumber()
  COLLECTOR_PORT!: number;

  @IsString()
  @IsNotEmpty()
  COLLECT_ENDPOINT!: string;

  @IsString()
  @IsNotEmpty()
  COLLECTOR_API_TOKEN!: string;

  @IsString()
  @IsNotEmpty()
  RABBITMQ_URL!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  RABBITMQ_QUEUE?: string;

  @IsString()
  @IsNotEmpty()
  CLICKHOUSE_URL!: string;

  @IsString()
  @IsNotEmpty()
  CLICKHOUSE_USER!: string;

  @IsString()
  @IsOptional()
  CLICKHOUSE_PASSWORD?: string;

  @IsString()
  @IsNotEmpty()
  CLICKHOUSE_DB!: string;

  @IsString()
  @IsNotEmpty()
  CLICKHOUSE_EVENTS_TABLE!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return config;
}
