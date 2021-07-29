// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyDclqvhXs1_CiWdLzekqGxqT6_c6FH0_rE',
    authDomain: 'srp-telematica.firebaseapp.com',
    projectId: 'srp-telematica',
    storageBucket: 'srp-telematica.appspot.com',
    messagingSenderId: '191136644661',
    appId: '1:191136644661:web:8aa605ba89cbde2052fb7c',
    measurementId: 'G-MY2P2GQXWX'
  },
  server: 'http://localhost:3000',
  reCaptchaSiteKey: '6Lck7PEaAAAAAPv76tJj9hQ-jQonIH_O1L-edzXS'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
