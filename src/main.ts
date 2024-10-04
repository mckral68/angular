import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule,
  IMAGE_CONFIG,
  PRECONNECT_CHECK_BLOCKLIST,
  provideImgixLoader,
} from '@angular/common';
import { AppRoute } from './app/routes/routes';
import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { environment } from './environments/environment';
import {
  provideHttpClient,
  HTTP_INTERCEPTORS,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { HttpErrorHandlerInterceptorService } from 'app/services/common/http-error-handler-interceptor.service';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { IConfig, provideEnvironmentNgxMask } from 'ngx-mask';
import { provideServiceWorker } from '@angular/service-worker';

if (environment.production) {
  enableProdMode();
}
const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};
const maskConfig: Partial<IConfig> = {
  validation: false,
};
export function tokenGetter() {
  return localStorage.getItem('accessToken');
}
bootstrapApplication(AppComponent, {
  providers: [
    provideImgixLoader('https://eylulcommerce.blob.core.windows.net/'),
    provideEnvironmentNgxMask(maskConfig),
    provideEnvironmentNgxMask(maskConfigFunction),
    // {
    //   provide: 'baseUrl',
    //   useValue: 'https://api.eylulmodalife.web.tr/api',
    //   multi: true,
    // },
    // {
    //   provide: 'baseSignalRUrl',
    //   useValue: 'https://api.eylulmodalife.web.tr/',
    //   multi: true,
    // },
    { provide: 'baseUrl', useValue: 'https://localhost:7131/api', multi: true },

    {
      provide: 'baseSignalRUrl',
      useValue: 'https://localhost:7131/',
      multi: true,
    },
    importProvidersFrom(
      CommonModule,
      BrowserModule,
      BrowserAnimationsModule,
      SocialLoginModule,
      RouterModule.forRoot(AppRoute, { scrollPositionRestoration: 'top' }),
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:7131'],
        },
      }),
      ToastrModule.forRoot({
        preventDuplicates: true,
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
      })
    ),
    {
      provide: 'SocialAuthServiceConfig',

      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '669065604382-u13us5hpci50kme1e9tpre4qqukhqear.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('546631843676576'),
          },
        ],
        onError: (err) => console.log(err),
      } as SocialAuthServiceConfig,
    },
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorHandlerInterceptorService,
      multi: true,
    },
    {
      provide: PRECONNECT_CHECK_BLOCKLIST,
      useValue: 'https://eylulcommerce.blob.core.windows.net/',
    },
    {
      provide: IMAGE_CONFIG,
      useValue: {
        breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920],
      },
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
});
