import {Module} from "@nestjs/common";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {AgentModule} from "./agent/agent.module";
import {IssuerModule} from "./issuer/issuer.module";
import {VerifierModule} from "./verifier/verifier.module";
import { ConfigModule } from "@nestjs/config";
import configuration from './config/configuration';

@Module({
  imports: [
    AgentModule,
    IssuerModule,
    VerifierModule,
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigService available everywhere
      load: [configuration],
      envFilePath: ".env", // default is '.env' in project root
      ignoreEnvFile: false, // ensure it reads the file
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
