import {BadRequestException, ConflictException, Injectable, Logger, NotImplementedException} from "@nestjs/common";
import {AgentService} from "../agent/agent.service";
import type {Agent} from "@credo-ts/core";
import {
  OpenId4VcSiopAuthorizationResponsePayload,
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

  /** getAllVerifiers are not implemented cause get all can impact query performance if too many verifier record */

  async getVerifiersByQuery(limit: number, offset: number) {
    if (limit > 256 || limit <= 0) {
      throw new BadRequestException("Invalid limit value");
    }
    if (offset < 0) {
      throw new BadRequestException("Invalid offset value");
    }
    const agent = this.agent;
    const verifierRepository = agent.dependencyManager.resolve(OpenId4VcVerifierRepository);
    const verifierRecord = await verifierRepository.findByQuery(agent.context, {}, {limit: limit, offset: offset});
    return verifierRecord;
  }

  async getVerifierByVerifierId(verifierId?: string) {
    if (verifierId === undefined) {
      throw new BadRequestException("Missing verifierId parameter");
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

  async getVerifiedAuthorizationResponse(verficationSessionId: string) {
    return await this.verifierApi.getVerifiedAuthorizationResponse(verficationSessionId);
  }

  async findVerificationSessionForAuthorizationResponse(
    authorizationResponse: OpenId4VcSiopAuthorizationResponsePayload,
    verfierId?: string
  ) {
    return await this.verifierApi.findVerificationSessionForAuthorizationResponse({
      authorizationResponse: authorizationResponse,
      verifierId: verfierId,
    });
  }

  /** @TODO implementing in @credo-ts/openid4vc 0.6.x */
  async updateVerifierMetadata() {
    throw new NotImplementedException("updateVerifierMetadata() not yet available in @credo-ts/openid4vc 0.5.x");
  }
}
