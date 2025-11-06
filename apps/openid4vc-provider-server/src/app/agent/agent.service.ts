import {Injectable, Logger} from "@nestjs/common";
import {Agent, ConsoleLogger, LogLevel} from "@credo-ts/core";
import {agentDependencies} from "@credo-ts/node";
import {OpenId4VcIssuerModule, OpenId4VcVerifierModule} from "@credo-ts/openid4vc";
import {Router} from "express";
import {AskarModule} from "@credo-ts/askar";
import {askar as ariesAskar} from "@openwallet-foundation/askar-nodejs";
import {ConfigService} from "@nestjs/config";
// import {RedisCache} from "@credo-ts/redis-cache";

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private agent!: Agent;
  private issuerRouter: Router;
  private verifierRouter: Router;

  constructor(private readonly configService: ConfigService) {
    this.issuerRouter = Router();
    this.verifierRouter = Router();
  }

  async onModuleInit() {
    /** @TODO configService should validation .env configuration */
    const env = (this.configService.get<string>("ENV") ?? "development").toLocaleLowerCase();
    const org = (this.configService.get<string>("ORG") ?? "default-org").toLowerCase();
    // get baseUrlApi from process.env.BASE_URI_API
    // get WALLET_CONFIG_ID from process.env.WALLET_CONFIG_ID
    // get WALLET_CONFIG_KEY from process.env.WALLET_CONFIG_WALLET
    // get ENDPOINT from process.env.ENDPOINT
    /** @TODO add endpoints */
    /** @TODO add redis distributed key locking for preventing race condition */
    this.agent = new Agent({
      config: {
        label: `${org}:provider:${env}`, // org:provider:env
        logger: new ConsoleLogger(LogLevel.debug), // No need to map credo logger into nest log rn.
        walletConfig: {
          id: "openid4vc-wallet",
          key: "your-secret-key-here",
          // storage: "postgres" // postgres as preferred storage.
        },
      },
      dependencies: agentDependencies,
      modules: {
        ariesAskar: new AskarModule({ariesAskar}),
        // cache: new RedisCache({
        //   port: `${redisPort}`, // Redis port
        //   host: `${redisHost}`, // Redis host
        //   username: `${redisUsername}`, // needs Redis >= 6
        //   password: `${redisPassword}`,
        //   db: `${redisDb}`, // Defaults to 0
        // }),
        // kms: new CustomKms({}),
        openId4VcIssuer: new OpenId4VcIssuerModule({
          baseUrl: `http:localhost:3000/api/oid4vci`,
          router: this.issuerRouter,
          endpoints: {
            credential: {
              credentialRequestToCredentialMapper: async () => {
                throw new Error("Not implemented");
              },
            },
            // credentialOffer: {}
            // accessToken: {}
          },
        }),
        openId4VcVerifier: new OpenId4VcVerifierModule({
          baseUrl: `http:localhost:3000/api/odi4vcp`,
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
