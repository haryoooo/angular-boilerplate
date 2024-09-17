// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Enums
import { EnvName } from '@enums/environment.enum';

// Packages
import packageInfo from '../../package.json';

const scheme = 'http://';
const host = 'localhost';
const port = ':5000';
const path = '/api/';

const baseUrl = scheme + host + port + path;

export const environment = {
  production: false,
  version: packageInfo.version,
  appName: 'EasyAngular',
  envName: EnvName.LOCAL,
  defaultLanguage: 'en',
  apiBaseUrl: baseUrl,
  apiKey: 'AIzaSyDoSPMV9RkYmpXsQ7If3PmkFemjk16UQkQ',
  authDomain: 'budget-tracker-app-2af6f.firebaseapp.com',
  projectId: 'budget-tracker-app-2af6f',
  storageBucket: 'budget-tracker-app-2af6f.appspot.com',
  messagingId: '810222244862',
  appId: '1:810222244862:web:b364b7dd8b2e35dbf4e6af',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
