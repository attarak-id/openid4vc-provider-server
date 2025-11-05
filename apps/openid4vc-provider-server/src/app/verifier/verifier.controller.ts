import {Body, Controller, Get, Param, Post, Res} from "@nestjs/common";
import {VerifierService} from "./verifier.service";

@Controller("verifier")
export class VerifierController {
  constructor(private readonly verifierService: VerifierService) {}

  @Get("get-all-verifiers")
  async getAllVerifiers() {
    try {
      return this.verifierService.getAllVerifiers();
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  public async getVerifierByVerifierId(@Param("id") id: string) {
    try {
      return await this.verifierService.getVerifierByVerifierId(id);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  public async createVerifier(@Body() verifierId?:string) {
    try {
      return await this.verifierService.createVerifier(verifierId);
    } catch (error) {
      throw error;
    }
  }
}
