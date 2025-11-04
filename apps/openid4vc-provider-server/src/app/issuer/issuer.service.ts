import {Injectable, Logger} from "@nestjs/common";
import {AgentService} from "../agent/agent.service";
import {OpenId4VcIssuerRepository} from "@credo-ts/openid4vc/build/openid4vc-issuer/repository";
import type {Agent} from "@credo-ts/core";
import type {
  OpenId4VciCreateCredentialOfferOptions,
  OpenId4VciCreateCredentialResponseOptions,
  OpenId4VciCreateIssuerOptions,
  OpenId4VciCredentialRequest,
  OpenId4VcIssuerApi,
} from "@credo-ts/openid4vc";

@Injectable()
export class IssuerService {
  // private readonly logger = new Logger(IssuerService.name);

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

  async getIssuerByIssuerId(issuerId: string) {
    return await this.issuerApi.getIssuerByIssuerId(issuerId);
  }

  async getIssuerMetadata(issuerId: string) {
    return await this.issuerApi.getIssuerMetadata(issuerId);
  }

  // @TODO change from any to type strict.
  async updateIssuerMetadata(issuerId: string, issuerRecordProps: any): Promise<void> {
    await this.issuerApi.updateIssuerMetadata({
      issuerId: issuerId,
      ...issuerRecordProps,
    });
  }

  // @TODO handling the options.
  async createIssuer(createIssuerOption: OpenId4VciCreateIssuerOptions) {
    return await this.issuerApi.createIssuer(createIssuerOption);
  }

  // @TODO handling preventing deleting not existing.
  async deleteIssuer(issuerId: string): Promise<void> {
    const agent = this.agent;
    const repository = agent.dependencyManager.resolve(OpenId4VcIssuerRepository);
    await repository.deleteById(agent.context, issuerId);
  }

  async rotateAccessTokenSigningKey(issuerId: string): Promise<void> {
    return await this.issuerApi.rotateAccessTokenSigningKey(issuerId);
  }

  // @TODO handling the options.
  async findIssuanceSessionForCredentialRequest(credentialRequest: OpenId4VciCredentialRequest, issuerId?: string) {
    return await this.issuerApi.findIssuanceSessionForCredentialRequest({
      credentialRequest: credentialRequest,
      issuerId: issuerId,
    });
  }

  // @TODO handling the options.
  async createCredentialOffer(issuerId: string, options: OpenId4VciCreateCredentialOfferOptions) {
    return await this.issuerApi.createCredentialOffer({
      issuerId: issuerId,
      ...options,
    });
  }

  // @TODO handling the options.
  async createCredentialResponse(issuanceSessionId: string, options: OpenId4VciCreateCredentialResponseOptions) {
    return await this.issuerApi.createCredentialResponse({
      issuanceSessionId: issuanceSessionId,
      ...options
    });
  }
}
