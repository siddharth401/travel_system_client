/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}


/* Smartadmin integration { */

declare var System: SystemJS;
interface SystemJS {
  import: (path?: string) => Promise<any>;
}

interface WebpackRequire {
  (id: string): any;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure(ids: string[], callback: (req: WebpackRequire) => void, chunkName?: string): void;
  context(directory: string, useSubDirectories?: boolean, regExp?: RegExp): WebpackContext;
}

interface WebpackContext extends WebpackRequire {
  keys(): string[];
}

// Extend typings
interface NodeRequire extends WebpackRequire {}
//interface ErrorConstructor extends ErrorStackTraceLimit {}
//interface NodeRequireFunction extends Es6PromiseLoader  {}
//interface NodeModule extends WebpackModule {}
//interface Global extends GlobalEnvironment  {}

declare var $: any;
declare var require: NodeRequire;

/* Smartadmin integration } */

