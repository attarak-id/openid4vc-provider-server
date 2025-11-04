import {Controller, Get, Param, Res} from "@nestjs/common";
import {VerifierService} from "./verifier.service";

@Controller('verifier')
export class VerifierController {
  constructor(private readonly verifierService: VerifierService) {}

  @Get("get-all-verifiers")
  async getAllVerifiers() {
    return this.verifierService.getAllVerifiers();
  }


  @Get(":id")
  public async getVerifierByVerifierId(@Param("id") id: string, @Res() res: any) {
    // try {
    return await this.verifierService.getVerifierByVerifierId(id);
      // return res.status(HttpStatus.OK).json(issuerInfo);
    // } catch (error) {
    //   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "INTERNAL_SERVER_ERROR"});
    // }
  }
}
