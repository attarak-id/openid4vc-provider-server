import { Module, OnModuleInit } from '@nestjs/common';
import { AgentService } from './agent.service';
import { IssuerController } from '../issuer/issuer.controller';
import { VerifierController } from '../verifier/verifier.controller';

@Module({
  providers: [AgentService],
  controllers: [IssuerController, VerifierController],
})
export class AgentModule implements OnModuleInit {
  constructor(private readonly agentService: AgentService) {}

  async onModuleInit() {
    await this.agentService.initialize();
  }
}
