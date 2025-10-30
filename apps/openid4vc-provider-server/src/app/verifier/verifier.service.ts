import {Injectable} from "@nestjs/common";
import {AgentService} from "../agent/agent.service";
import type {Agent} from "@credo-ts/core";
import type {OpenId4VcVerifierApi} from "@credo-ts/openid4vc";

@Injectable()
export class VerifierService {
  constructor(private readonly agentService: AgentService) {}

  private get agent(): Agent {
    return this.agentService.getAgent() as Agent;
  }

  private get verifierApi(): OpenId4VcVerifierApi {
    return this.agent.modules.openId4VcVerifier;
  }

  async getAllVerifiers() {
    return await this.verifierApi.getAllVerifiers();
  }
}
