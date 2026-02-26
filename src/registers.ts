import { commands, workspace, ExtensionContext, ConfigurationChangeEvent } from 'vscode';

const someChanged = (e: ConfigurationChangeEvent, ...names: ConfigName[]) =>
  names.some((name) => e.affectsConfiguration(`jetbrains-titlebar.${name}`));

const cmd = (c: CommandName, cb: (...args: unknown[]) => unknown) =>
  commands.registerCommand(`jetbrains-titlebar.${c}`, cb);

export default (context: ExtensionContext) => {
  context.subscriptions.push(workspace.onDidChangeConfiguration((e) => {}));
};
