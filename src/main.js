"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var environment_1 = require("./environments/environment");
if (environment_1.environment.production) {
  (0, core_1.enableProdMode)();
}
(0, platform_browser_dynamic_1.platformBrowserDynamic)()
  .bootstrapModule({ ngZone: "noop" })
  .catch(function (err) {
    return console.error(err);
  });
