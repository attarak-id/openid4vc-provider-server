import { Module } from '@nestjs/common'
import { VerifierController } from './verifier.controller'
import { VerifierService } from './verifier.service'
import { AgentModule } from '../agent/agent.module'

@Module({
  imports: [AgentModule],
  controllers: [VerifierController],
  providers: [VerifierService],
})
export class VerifierModule {}
