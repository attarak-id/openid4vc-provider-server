import { Controller, Get } from '@nestjs/common'
import { VerifierService } from './verifier.service'

@Controller('verifier')
export class VerifierController {
  constructor(private readonly verifierService: VerifierService) {}

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
    return this.verifierService.getAgentInfo()
  }
}
