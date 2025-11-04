import {Controller, Get, Post, Body, Param, Delete, Res, HttpStatus} from "@nestjs/common";
import {IssuerService} from "./issuer.service";
import type {OpenId4VciCreateIssuerOptions} from "@credo-ts/openid4vc";

@Controller("issuer")
export class IssuerController {
  constructor(private readonly issuerService: IssuerService) {}

  @Get("get-all-issuers")
  public async getAllIssuers() {
    return this.issuerService.getAllIssuers();
  }

  @Get(":id")
  public async getIssuerByIssuerId(@Param('id') id:string, @Res() res: any) {
    // try 
    const issuerInfo= await this.issuerService.getIssuerByIssuerId(id);
      return res.status(HttpStatus.OK).json(issuerInfo);
    // } catch (error) {
    //   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: "INTERNAL_SERVER_ERROR"});
    // }
  }

  @Post()
  public async createIssuer(@Body() config?: OpenId4VciCreateIssuerOptions) {
    try {
      // Test data for creating an issuer
      const testIssuerConfig: OpenId4VciCreateIssuerOptions = config || {
        issuerId: "9bf7d666-2d9f-4acf-abf1-34c8a2847514",
        display: [
          {
            name: "University of the Thai Chamber of Commerce Diploma",
            description:
              "University of the Thai Chamber of Commerce Diploma is given to all students that graduated from university",
            text_color: "#000000",
            background_color: "#FFFFFF",
            logo: {
              url: "https://example.com/logo.png",
              alt_text: "logo img",
            },
            background_image: {
              url: "https://example.com/background.png",
              alt_text: "background img",
            },
          },
        ],
        credentialsSupported: [
          {
            id: "UniversityDegreeCredential",
            format: "jwt_vc_json",
            types: ["VerifiableCredential", "UniversityDegreeCredential"],
          },
          {
            id: "UniversityDegreeCredential-sdjwt",
            format: "vc+sd-jwt",
            vct: "UniversityDegreeCredential",
            cryptographic_binding_methods_supported: ["did:key"],
          },
        ],
      };

      return await this.issuerService.createIssuer(testIssuerConfig);
    } catch (error) {
      throw new Error("Failed to create issuer");
    }
  }

  @Delete("delete-issuer/:issuerId")
  public async deleteIssuer(@Param("issuerId") issuerId: string) {
    return this.issuerService.deleteIssuer(issuerId);
  }
}
