import { Controller, Get } from '@nestjs/common'
import { IssuerService } from './issuer.service'

@Controller('issuer')
export class IssuerController {
  constructor(private readonly issuerService: IssuerService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Issuer controller is running',
    }
  }

  @Get('agent-info')
  async getAgentInfo() {
    return this.issuerService.getAgentInfo()
  }
}
