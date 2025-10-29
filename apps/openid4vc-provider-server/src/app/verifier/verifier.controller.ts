import { Controller, Get } from "@nestjs/common";
import { AgentService } from "../agent/agent.service";

@Controller("verifier")
export class VerifierController {
    // private readonly logger = new Logger(IssuerController.name);

    constructor(private readonly agentService: AgentService) {}

    // Test endpoint to check if controller is working
    @Get('health')
    health() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Verifier controller is running'
        };
    }

    // Get agent info
    @Get('agent-info')
    async getAgentInfo() {
        const agent = this.agentService.getAgent();
        return {
            label: agent.config.label,
            isInitialized: agent.isInitialized,
            agentId: agent.context.contextCorrelationId
        };
    }
}