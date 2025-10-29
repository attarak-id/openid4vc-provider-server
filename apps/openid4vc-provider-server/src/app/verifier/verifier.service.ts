import { Injectable } from '@nestjs/common'
import { AgentService } from '../agent/agent.service'
import type { Agent } from '@credo-ts/core'

@Injectable()
export class VerifierService {
  constructor(private readonly agentService: AgentService) {}

  verifierAgent(): Agent {
    return this.agentService.getAgent()
  }

  async getAgentInfo() {
    const agent = this.verifierAgent()
    return {
      label: agent.config.label,
      isInitialized: agent.isInitialized,
      agentId: agent.context.contextCorrelationId,
    }
  }
}
