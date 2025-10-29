import { All, Controller, Next, Req, Res } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { AgentService } from '../agent/agent.service';

@Controller('oid4vci')
export class IssuerController {
  constructor(private readonly agentService: AgentService) {}

  @All('*')
  handleIssuerRequests(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const router = this.agentService.getIssuerRouter();
    router(req, res, next);
  }
}
