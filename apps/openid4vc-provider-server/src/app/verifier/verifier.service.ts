import {Injectable} from "@nestjs/common";
import {AgentService} from "../agent/agent.service";
import type {OpenId4VcVerifierApi} from "@credo-ts/openid4vc";

@Injectable()
export class VerifierService {
  constructor(private readonly agentService: AgentService) {}

  private verifier(): OpenId4VcVerifierApi {
    return this.agentService.getAgent().modules.openId4VcVerifier;
  }

  async getAllVerifiers() {
    const verifiers = await this.verifier().getAllVerifiers();
    return {verifiers};
  }

  // @TODO add other apis.
}
