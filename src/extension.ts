import { ExtensionContext } from 'vscode';
import registers from './registers.js';

export const activate = async (context: ExtensionContext) => {
  registers(context);
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};
