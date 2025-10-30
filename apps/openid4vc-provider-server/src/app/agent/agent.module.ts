import {Module, NestModule, MiddlewareConsumer, Logger} from "@nestjs/common";
import {AgentService} from "./agent.service";
import {AgentController} from "./agent.controller";

@Module({
  providers: [AgentService],
  controllers: [AgentController],
  exports: [AgentService],
})
export class AgentModule implements NestModule {
  private readonly logger = new Logger(AgentModule.name);

  constructor(private readonly agentService: AgentService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.agentService.getIssuerRouter()).forRoutes("/issuer/oid4vci");

    consumer.apply(this.agentService.getVerifierRouter()).forRoutes("/verifier/siop");

    this.logger.log("credo-ts express issuer and verifier routers mounted successfully");
  }
}
