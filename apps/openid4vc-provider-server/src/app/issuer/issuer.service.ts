import {Injectable} from "@nestjs/common";
import {AgentService} from "../agent/agent.service";
import {OpenId4VcIssuerApi} from "@credo-ts/openid4vc";

@Injectable()
export class IssuerService {
  constructor(private readonly agentService: AgentService) {}

  private issuer(): OpenId4VcIssuerApi {
    return this.agentService.getAgent().modules.openId4VcIssuer;
  }

  async getAllIssuers() {
    const issuers = await this.issuer().getAllIssuers();
    return {issuers};
  }

  // @TODO add other apis.
}
