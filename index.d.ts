import * as React from 'react';

declare function hoistNonReactStatics<T extends React.ComponentType>(
  TargetComponent: T,
  SourceComponent: React.ComponentType,
  customStatic?: any): T;

export default hoistNonReactStatics
