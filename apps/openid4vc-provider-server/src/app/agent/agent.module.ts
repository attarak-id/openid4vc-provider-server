import { Module, NestModule, MiddlewareConsumer, OnModuleInit, Logger } from '@nestjs/common';
import { AgentService } from './agent.service';
import { IssuerController } from '../issuer/issuer.controller';
import { VerifierController } from '../verifier/verifier.controller';

@Module({
  providers: [AgentService],
  controllers: [IssuerController, VerifierController],
  exports: [AgentService],
})
export class AgentModule implements OnModuleInit, NestModule {
  private readonly logger = new Logger(AgentModule.name);

  constructor(private readonly agentService: AgentService) {}

  async onModuleInit() {
    await this.agentService.initialize();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(this.agentService.getIssuerRouter())
      .forRoutes('/issuer/oid4vci');

    consumer
      .apply(this.agentService.getVerifierRouter())
      .forRoutes('/verifier/siop');

    this.logger.log('issuer and verifier routers router mounted successfully');
  }
}
