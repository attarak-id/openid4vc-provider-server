import {Injectable, Logger} from "@nestjs/common";
import {Agent, ConsoleLogger, KeyDidCreateOptions, KeyType, LogLevel, Buffer, DidKey} from "@credo-ts/core";
import {agentDependencies} from "@credo-ts/node";
import {OpenId4VcHolderModule, OpenId4VcIssuerModule, OpenId4VcVerifierModule} from "@credo-ts/openid4vc";
import {Router} from "express";
import {AskarModule} from "@credo-ts/askar";
import {askar} from "@openwallet-foundation/askar-nodejs";
import {ConfigService} from "@nestjs/config";
import "@credo-ts/askar";
// import {RedisCache} from "@credo-ts/redis-cache";

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private agent!: Agent;
  // private did;
  // private didKey;
  // private kid;
  // private verificationMethod;
  private issuerRouter: Router;
  private verifierRouter: Router;

  constructor(private readonly configService: ConfigService) {
    this.issuerRouter = Router();
    this.verifierRouter = Router();
  }

  async onModuleInit() {
    /** @TODO configService should validation .env configuration */
    const environment = (this.configService.get<string>("env") ?? "development").toLocaleLowerCase();
    const organization = (this.configService.get<string>("org") ?? "default-org").toLowerCase();
    /** wallet key use to unlock/decrypt wallet, not the wallet private key. */
    const walletKey = this.configService.get<string>("walletKey") ?? "password";
    const hostname = this.configService.get<string>("host") ?? "localhost";
    const port = this.configService.get<string>("port") ?? 3000;
    const protocol = this.configService.get<string>("protocol") ?? "http";
    const privKey =
      this.configService.get<string>("privatekey") ??
      "c8044bd67456787a365f30be932446121f98afafa12b46c014d155a5653a64d5"; // for use in development only.
    /** @TODO add endpoints */
    /** @TODO add redis distributed key locking for preventing race condition */
    this.agent = new Agent({
      config: {
        label: `${organization}:provider:${environment}`, // org:provider:env
        logger: new ConsoleLogger(LogLevel.debug), // No need to map credo logger into nest log rn.
        walletConfig: {
          id: `${organization}:wallet:${environment}`, // @credo-ts/tenants if manage multiple wallet
          key: walletKey,
          // storage: "postgres" // postgres as preferred storage.
        },
      },
      dependencies: agentDependencies,
      modules: {
        askar: new AskarModule({ariesAskar: askar}),
        // cache: new RedisCache({
        //   port: `${redisPort}`, // Redis port
        //   host: `${redisHost}`, // Redis host
        //   username: `${redisUsername}`, // needs Redis >= 6
        //   password: `${redisPassword}`,
        //   db: `${redisDb}`, // Defaults to 0
        // }),
        // openId4VcHolder: new OpenId4VcHolderModule(), // as a service provider/company may be store/request vc from other entities.
        openId4VcIssuer: new OpenId4VcIssuerModule({
          baseUrl: `${protocol}://${hostname}:${port}/api/oid4vci`,
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
          baseUrl: `${protocol}://${hostname}:${port}/api/odi4vcp`,
          router: this.verifierRouter,
        }),
      },
    });

    await this.agent.initialize();

    this.logger.log("Credo agent initialized successfully");

    // FIX ME: if the key exist it's throw error
    await this.agent.dids.create({
      keyType: KeyType.Ed25519,
      secret: {
        privateKey: Buffer.from(privKey, "hex"),
      },
    });

    /** FIX ME: it's should import if deploy as a worker pod.
     * but in monolith create a new fresh one if not supply the key/seed. */
    // await this.agent.dids.import({
    //   did: "did:key:<???>",
    //   privateKeys: [
    //     {
    //       keyType: KeyType.Ed25519,
    //       privateKey: Buffer.from(privKey, "hex"),
    //     },
    //   ],
    // });
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
