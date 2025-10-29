import { All, Controller, Next, Req, Res } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { AgentService } from '../agent/agent.service';

@Controller('siop')
export class VerifierController {
  constructor(private readonly agentService: AgentService) {}

  @All('*')
  handleVerifierRequests(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    const router = this.agentService.getVerifierRouter();
    router(req, res, next);
  }
}