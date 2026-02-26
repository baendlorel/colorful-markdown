import { ConfigurationTarget, workspace, WorkspaceConfiguration } from 'vscode';

export const getConfig = () => workspace.getConfiguration(Const.Name);

export namespace Cfg {
  // # config part
  let cache: WorkspaceConfiguration = getConfig();
  export function refresh() {
    cache = getConfig();
  }
  export const get = <T>(section: string, defaultValue: T) => cache.get(section, defaultValue);
  export const update: (
    section: string,
    value: any,
    configurationTarget?: ConfigurationTarget | boolean | null,
    overrideInLanguage?: boolean,
  ) => Promise<void> = async (section, value, configurationTarget, overrideInLanguage) => {
    await cache.update(section, value, configurationTarget, overrideInLanguage);
    cache = getConfig();
  };
}
