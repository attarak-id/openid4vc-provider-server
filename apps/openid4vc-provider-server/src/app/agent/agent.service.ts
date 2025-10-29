import { Injectable, Logger } from '@nestjs/common';
import { Agent } from '@credo-ts/core';
import { agentDependencies } from '@credo-ts/node';
import { OpenId4VcIssuerModule, OpenId4VcVerifierModule } from '@credo-ts/openid4vc';
import { Router } from 'express';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private agent!: Agent;
  public issuerRouter: Router;
  public verifierRouter: Router;

  constructor() {
    this.issuerRouter = Router();
    this.verifierRouter = Router();
  }

  async initialize() {
    this.agent = new Agent({
      config: {
        label: 'OpenID4VC Agent',
        walletConfig: {
          id: 'openid4vc-wallet',
          key: 'your-secret-key-here',
        },
      },
      dependencies: agentDependencies,
      modules: {
        // @TODO asker
        openId4VcIssuer: new OpenId4VcIssuerModule({
          baseUrl: 'http://127.0.0.1:3000/oid4vci',
          router: this.issuerRouter,
          endpoints: {
            credential: {
              credentialRequestToCredentialMapper: async () => {
                throw new Error('Not implemented');
              },
            },
          },
        }),
        openId4VcVerifier: new OpenId4VcVerifierModule({
          baseUrl: 'http://127.0.0.1:3000/siop',
          router: this.verifierRouter,
        }),
      },
    });

    await this.agent.initialize();
    this.logger.log('Credo agent initialized successfully');
  }

  getAgent(): Agent {
    return this.agent;
  }

  getIssuerRouter(): Router {
    return this.issuerRouter;
  }

  getVerifierRouter(): Router {
    return this.verifierRouter;
  }
}