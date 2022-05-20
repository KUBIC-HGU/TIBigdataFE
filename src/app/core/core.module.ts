import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from "angularx-social-login";
import { FooterComponent } from "./components/footer/footer.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ElasticSearchQueryModel } from "./models/elasticsearch.service.query.model";
import {TranslateModule} from '@ngx-translate/core';




// Google API ID
export const PROVIDER_ID: string =
  "576807286455-35sjp2v8leqpfeg3qj7k2rfr3avns7a5.apps.googleusercontent.com";

@NgModule({
  declarations: [NavbarComponent, FooterComponent],
    imports: [CommonModule, SocialLoginModule, TranslateModule],
  exports: [NavbarComponent, FooterComponent],
  providers: [
    ElasticSearchQueryModel,
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(PROVIDER_ID),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
})
export class CoreModule { }
