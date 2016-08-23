// Type definitions for hoist-non-react-statics
// Project: https://github.com/mridgway/hoist-non-react-statics
// Definitions by: acrazing <joking.young@gmail.com>
// Definitions: https://github.com/mridgway/hoist-non-react-statics/index.d.ts

declare module "hoist-non-react-statics" {
  import {Component} from 'react'
  function hoistNonReactStatics(TargetComponent: typeof Component, SourceComponent: typeof Component, customStatic?: any): typeof Component;
  export = hoistNonReactStatics
}
