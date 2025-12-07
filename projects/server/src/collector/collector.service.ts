import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { StatsFilterDto } from '@lemnity/nest-common'

type SummaryResponse = { events: number }
type TimeseriesResponse = { bucket: string; events: number }[]

@Injectable()
export class CollectorService {
  private readonly baseUrl: string
  private readonly token: string

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('COLLECTOR_API_URL') ?? 'http://collector:4000'
    this.token = this.config.get<string>('COLLECTOR_API_TOKEN') ?? ''
  }

  async summary(filter: StatsFilterDto): Promise<SummaryResponse> {
    return this.post<SummaryResponse>('/internal/stats/summary', filter)
  }

  async timeseries(filter: StatsFilterDto): Promise<TimeseriesResponse> {
    return this.post<TimeseriesResponse>('/internal/stats/timeseries', filter)
  }

  async events(filter: StatsFilterDto) {
    return this.post('/internal/stats/events', filter)
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-collector-token': this.token
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const text = await res.text()
      throw new InternalServerErrorException(
        `Collector request failed (${res.status}): ${text || res.statusText}`
      )
    }
    return (await res.json()) as T
  }
}
