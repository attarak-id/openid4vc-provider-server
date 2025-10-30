import {Controller, Get} from "@nestjs/common";
import {VerifierService} from "./verifier.service";

@Controller('verifier')
export class VerifierController {
  constructor(private readonly verifierService: VerifierService) {}

  @Get("get-all-verifiers")
  async getAllVerifiers() {
    return this.verifierService.getAllVerifiers();
  }
}
