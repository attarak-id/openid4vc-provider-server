import {Body, Controller, Get, NotFoundException, Param, Post, Query} from "@nestjs/common";
import {VerifierService} from "./verifier.service";
import {RecordNotFoundError} from "@credo-ts/core";

@Controller("oid4vc/verifier")
export class VerifierController {
  constructor(private readonly verifierService: VerifierService) {}

  @Get("verifiers")
  async getVerifiersByQuery(@Query("limit") limit: number, @Query("offset") offset: number) {
    try {
      return this.verifierService.getVerifiersByQuery(limit, offset);
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  public async getVerifierByVerifierId(@Param("id") id: string) {
    try {
      return await this.verifierService.getVerifierByVerifierId(id);
    } catch (error) {
      if (error instanceof RecordNotFoundError) {
        throw new NotFoundException(`verifierId:${id} not found`);
      }
      throw error;
    }
  }

  @Get()
  public async getVerifierByQueryVerifierId(@Query("id") id: string) {
    try {
      return await this.verifierService.getVerifierByVerifierId(id);
    } catch (error) {
      if (error instanceof RecordNotFoundError) {
        throw new NotFoundException(`verifierId:${id} not found`);
      }
      throw error;
    }
  }

  @Post()
  public async createVerifier(@Body() verifierId?: string) {
    try {
      return await this.verifierService.createVerifier(verifierId);
    } catch (error) {
      throw error;
    }
  }

  /** @TODO add other api */
}
