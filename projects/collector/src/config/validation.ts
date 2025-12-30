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
  @IsOptional()
  COLLECTOR_RABBITMQ_FALLBACK?: string;

  @IsString()
  @IsOptional()
  COLLECTOR_INTERNAL_EVENTS_URL?: string;

  @IsNumber()
  @IsOptional()
  COLLECTOR_GATEWAY_SUB_BATCH_SIZE?: number;

  @IsNumber()
  @IsOptional()
  COLLECTOR_GATEWAY_SUB_FLUSH_INTERVAL_MS?: number;

  @IsString()
  @IsOptional()
  RABBITMQ_URL?: string;

  @IsString()
  @IsOptional()
  RABBITMQ_GATEWAY_URL?: string;

  @IsString()
  @IsOptional()
  RABBITMQ_HOST?: string;

  @IsNumber()
  @IsOptional()
  RABBITMQ_PORT?: number;

  @IsString()
  @IsOptional()
  RABBITMQ_USER?: string;

  @IsString()
  @IsOptional()
  RABBITMQ_PASSWORD?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  RABBITMQ_QUEUE?: string;

  @IsString()
  @IsOptional()
  RABBITMQ_EXCHANGE?: string;

  @IsString()
  @IsOptional()
  RABBITMQ_ROUTING_KEY?: string;

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

  const hasRabbitmqUrl = Boolean(validatedConfig.RABBITMQ_URL);
  const hasRabbitmqParts = Boolean(
    validatedConfig.RABBITMQ_HOST &&
      validatedConfig.RABBITMQ_PORT &&
      validatedConfig.RABBITMQ_USER &&
      validatedConfig.RABBITMQ_PASSWORD,
  );
  if (!hasRabbitmqUrl && !hasRabbitmqParts) {
    throw new Error(
      'RabbitMQ config is missing. Provide RABBITMQ_URL or RABBITMQ_HOST/RABBITMQ_PORT/RABBITMQ_USER/RABBITMQ_PASSWORD',
    );
  }
  return config;
}
