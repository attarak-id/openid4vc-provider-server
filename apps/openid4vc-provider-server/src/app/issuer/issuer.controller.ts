import {Controller, Get, Post, Body, Param, Delete, Query, NotFoundException} from "@nestjs/common";
import {IssuerService} from "./issuer.service";
import type {OpenId4VciCreateIssuerOptions} from "@credo-ts/openid4vc";
import {RecordNotFoundError} from "@credo-ts/core";

@Controller("oid4vc/issuer")
export class IssuerController {
  constructor(private readonly issuerService: IssuerService) {}

  @Get("issuers")
  public async getIssuersByQuery(@Query("limit") limit: number, @Query("offset") offset: number) {
    try {
      return this.issuerService.getIssuersByQuery(limit, offset);
    } catch (error) {
      throw error;
    }
  }

  @Get(":id")
  public async getIssuerByIssuerId(@Param("id") id?: string) {
    try {
      return await this.issuerService.getIssuerByIssuerId(id);
    } catch (error) {
      if (error instanceof RecordNotFoundError) {
        throw new NotFoundException(`issuerId:${id} not found`);
      }
      throw error;
    }
  }

  @Get()
  public async getIssuerByQueryIssuerId(@Query("id") id: string) {
    try {
      return await this.issuerService.getIssuerByIssuerId(id);
    } catch (error) {
      if (error instanceof RecordNotFoundError) {
        throw new NotFoundException(`issuerId:${id} not found`);
      }
      throw error;
    }
  }

  @Get(":id/metadata")
  public async getIssuerMetadata(@Param("id") id: string) {
    try {
      return await this.issuerService.getIssuerMetadata(id);
    } catch (error) {
      if (error instanceof RecordNotFoundError) {
        throw new NotFoundException(`issuerId:${id} not found`);
      }
      throw error;
    }
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
      throw error;
    }
  }

  @Delete(":id")
  public async deleteIssuer(@Param("id") id: string) {
    try {
      return this.issuerService.deleteIssuer(id);
    } catch (error) {
      throw error;
    }
  }

  // @Post("create-credential-offer")
  // public async createCredentialOffer() {
  //   try {
  //     return this.issuerService.createCredentialOffer();
  //   } catch (error) {
  //     throw error
  //   }
  // }

  /** @TODO add other api */
}
