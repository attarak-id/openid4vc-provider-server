import {BadRequestException, ConflictException, Injectable, Logger, NotFoundException} from "@nestjs/common";
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
  private readonly logger = new Logger(IssuerService.name);

  constructor(private readonly agentService: AgentService) {}

  private get agent(): Agent {
    return this.agentService.getAgent() as Agent;
  }

  private get issuerApi(): OpenId4VcIssuerApi {
    return this.agent.modules.openId4VcIssuer;
  }

  /** getAllIssuers are not implemented cause get all can impact query performance if too many issuers record */

  async getIssuersByQuery(limit?: number, offset?: number) {
    if (limit === undefined || limit > 256 || limit <= 0) {
      throw new BadRequestException({message: "Invalid limit", parameter: "limit"});
    }
    if (offset === undefined || offset < 0) {
      throw new BadRequestException({message: "Invalid offset", parameter: "offset"});
    }
    const agent = this.agent;
    const issuerRepository = agent.dependencyManager.resolve(OpenId4VcIssuerRepository);
    const issuerRecord = await issuerRepository.findByQuery(agent.context, {}, {limit: limit, offset: offset});
    return issuerRecord;
  }

  async getIssuerByIssuerId(issuerId?: string) {
    if (!issuerId) {
      this.logger.error(`Missing required parameter issuerId`);
      throw new BadRequestException({
        message: "Missing required parameter",
        parameter: "issuerId",
      });
    }
    return await this.issuerApi.getIssuerByIssuerId(issuerId);
  }

  async getIssuerMetadata(issuerId: string) {
    return await this.issuerApi.getIssuerMetadata(issuerId);
  }

  /** @TODO change from any to type strict. */
  async updateIssuerMetadata(issuerId: string, issuerRecordProps: any): Promise<void> {
    await this.issuerApi.updateIssuerMetadata({
      issuerId: issuerId,
      ...issuerRecordProps,
    });
  }

  /** @TODO handling the options. */
  async createIssuer(createIssuerOption: OpenId4VciCreateIssuerOptions) {
    const agent = this.agent;
    const {issuerId} = createIssuerOption;
    if (!issuerId) {
      return await this.agent.modules.openId4VcIssuer.createIssuer(createIssuerOption);
    }
    const issuerRepository = agent.dependencyManager.resolve(OpenId4VcIssuerRepository);
    const issuerRecord = await issuerRepository.findByIssuerId(agent.context, issuerId);
    if (!issuerRecord) {
      return await this.agent.modules.openId4VcIssuer.createIssuer(createIssuerOption);
    }
    this.logger.error(`Failed to create issuerId:${issuerId} already exists.`);
    throw new ConflictException(`Failed to create issuerId:${issuerId} already exists.`);
  }

  async deleteIssuer(issuerId: string): Promise<void> {
    const agent = this.agent;
    const issuerRepository = agent.dependencyManager.resolve(OpenId4VcIssuerRepository);
    const issuerRecord = await issuerRepository.findByIssuerId(agent.context, issuerId);
    if (!issuerRecord) {
      this.logger.error(`Failed to delete not exist issuerId:${issuerId}.`);
      throw new NotFoundException(`Failed to delete not exist issuerId:${issuerId}.`);
    }
    await issuerRepository.deleteById(agent.context, issuerRecord.id);
  }

  async rotateAccessTokenSigningKey(issuerId: string): Promise<void> {
    return await this.issuerApi.rotateAccessTokenSigningKey(issuerId);
  }

  /** @TODO handling the options. */
  async findIssuanceSessionForCredentialRequest(credentialRequest: OpenId4VciCredentialRequest, issuerId?: string) {
    return await this.issuerApi.findIssuanceSessionForCredentialRequest({
      credentialRequest: credentialRequest,
      issuerId: issuerId,
    });
  }

  /** @TODO handling the options.*/
  async createCredentialOffer(issuerId: string, options: OpenId4VciCreateCredentialOfferOptions) {
    return await this.issuerApi.createCredentialOffer({
      issuerId: issuerId,
      ...options,
    });
  }

  /** @TODO handling the options.*/
  async createCredentialResponse(issuanceSessionId: string, options: OpenId4VciCreateCredentialResponseOptions) {
    return await this.issuerApi.createCredentialResponse({
      issuanceSessionId: issuanceSessionId,
      ...options,
    });
  }
}
