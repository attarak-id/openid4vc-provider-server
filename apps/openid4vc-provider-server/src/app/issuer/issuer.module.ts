import { Module } from '@nestjs/common'
import { IssuerController } from './issuer.controller'
import { IssuerService } from './issuer.service'
import { AgentModule } from '../agent/agent.module'

@Module({
  imports: [AgentModule],
  controllers: [IssuerController],
  providers: [IssuerService],
})
export class IssuerModule {}
