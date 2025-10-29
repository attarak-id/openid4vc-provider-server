import { Injectable } from '@nestjs/common'
import { AgentService } from '../agent/agent.service'
import type { Agent } from '@credo-ts/core'

@Injectable()
export class IssuerService {
  constructor(private readonly agentService: AgentService) {}

  IssuerAgent(): Agent {
    return this.agentService.getAgent()
  }

  async getAgentInfo() {
    const agent = this.IssuerAgent()
    // console.log(await agent.modules.openId4VcIssuer.getByIssuerId("1")); // just for test
    return {
      label: agent.config.label,
      isInitialized: agent.isInitialized,
      agentId: agent.context.contextCorrelationId,
    }
  }
}
