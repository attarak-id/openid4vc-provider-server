import {Injectable, Logger} from "@nestjs/common";
import {Agent, ConsoleLogger, LogLevel} from "@credo-ts/core";
import {agentDependencies} from "@credo-ts/node";
import {OpenId4VcIssuerModule, OpenId4VcVerifierModule} from "@credo-ts/openid4vc";
import {Router} from "express";
import {AskarModule} from "@credo-ts/askar";
import {askar as ariesAskar} from "@openwallet-foundation/askar-nodejs";

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

  async onModuleInit() {
    /** @TODO configService */
    // get BASE_URI_API from process.env.BASE_URI_API
    // get LABEL from process.env.LABEL
    // get WALLET_CONFIG_ID from process.env.WALLET_CONFIG_ID
    // get WALLET_CONFIG_KEY from process.env.WALLET_CONFIG_WALLET
    // get ENDPOINT from process.env.ENDPOINT
    /** @TODO add endpoints */ 
    /** @TODO add redis distributed key locking for preventing race condition */
    this.agent = new Agent({
      config: {
        label: "OpenID4VC Agent",
        logger: new ConsoleLogger(LogLevel.debug),
        walletConfig: {
          id: "openid4vc-wallet",
          key: "your-secret-key-here",
          // storage: "postgres" // postgres as preferred storage.
        },
      },
      dependencies: agentDependencies,
      modules: {
        ariesAskar: new AskarModule({ariesAskar}),
        openId4VcIssuer: new OpenId4VcIssuerModule({
          baseUrl: `http:localhost:3000/api/issuer/oid4vci`,
          router: this.issuerRouter,
          endpoints: {
            credential: {
              credentialRequestToCredentialMapper: async () => {
                throw new Error("Not implemented");
              },
            },
          },
        }),
        openId4VcVerifier: new OpenId4VcVerifierModule({
          baseUrl: `http:localhost:3000/api/verifier/siop`,
          router: this.verifierRouter,
        }),
      },
    });

    await this.agent.initialize();

    this.logger.log("Credo agent initialized successfully");
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
