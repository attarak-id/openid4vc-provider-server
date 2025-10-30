import {Injectable} from "@nestjs/common";
import {AgentService} from "../agent/agent.service";
import {OpenId4VcIssuerRepository} from "@credo-ts/openid4vc/build/openid4vc-issuer/repository";
import type {Agent} from "@credo-ts/core";
import type {OpenId4VciCreateIssuerOptions, OpenId4VcIssuerApi} from "@credo-ts/openid4vc";

@Injectable()
export class IssuerService {
  constructor(private readonly agentService: AgentService) {}

  private get agent(): Agent {
    return this.agentService.getAgent() as Agent;
  }

  private get issuerApi(): OpenId4VcIssuerApi {
    return this.agent.modules.openId4VcIssuer;
  }

  async getAllIssuers() {
    return await this.issuerApi.getAllIssuers();
  }

  async createIssuer(createIssuerOption: OpenId4VciCreateIssuerOptions) {
    return await this.issuerApi.createIssuer(createIssuerOption);
  }

  async deleteIssuer(issuerId: string): Promise<void> {
    const agent = this.agent;
    const repository = agent.dependencyManager.resolve(OpenId4VcIssuerRepository);
    await repository.deleteById(agent.context, issuerId);
  }
}
