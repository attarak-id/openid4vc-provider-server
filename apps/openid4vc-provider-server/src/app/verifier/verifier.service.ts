import {BadRequestException, ConflictException, Injectable, Logger, NotImplementedException} from "@nestjs/common";
import {AgentService} from "../agent/agent.service";
import type {Agent} from "@credo-ts/core";
import {
  OpenId4VcVerifierRepository,
  type OpenId4VcSiopCreateAuthorizationRequestOptions,
  type OpenId4VcSiopVerifyAuthorizationResponseOptions,
  type OpenId4VcVerifierApi,
} from "@credo-ts/openid4vc";

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

  async getVerifierByVerifierId(verifierId?: string) {
    if (!verifierId) {
      throw new BadRequestException({
        message: "Missing required parameter",
        parameter: "verifierId",
      });
    }
    return await this.verifierApi.getVerifierByVerifierId(verifierId);
  }

  async createVerifier(verifierId?: string) {
    const agent = this.agent;
    if (verifierId) {
      const verifierRepository = agent.dependencyManager.resolve(OpenId4VcVerifierRepository);
      const verifierRecord = await verifierRepository.findByVerifierId(agent.context, verifierId);
      if (verifierRecord) {
        // create duplicate verifierId is not allowed.
        Logger.error(`Failed to create verifierId:${verifierId} already exists.`);
        throw new ConflictException(`Failed to create verifierId:${verifierId} already exists.`);
      }
    }
    return await this.verifierApi.createVerifier({verifierId});
  }

  /** @TODO dto type */
  async createAuthorizationRequest(
    createAuthorizationRequest: OpenId4VcSiopCreateAuthorizationRequestOptions & {verifierId: string}
  ) {
    return await this.verifierApi.createAuthorizationRequest(createAuthorizationRequest);
  }

  /** @TODO dto type */
  async verifyAuthorizationResponse(
    verifyAuthorizationResponseOptions: OpenId4VcSiopVerifyAuthorizationResponseOptions & {
      verificationSessionId: string;
    }
  ) {
    return await this.verifierApi.verifyAuthorizationResponse(verifyAuthorizationResponseOptions);
  }

  /** @TODO implementing in @credo-ts/openid4vc 0.6.x */
  async updateVerifierMetadata() {
    throw new NotImplementedException("updateVerifierMetadata() not yet available in @credo-ts/openid4vc 0.5.x");
  }
}
