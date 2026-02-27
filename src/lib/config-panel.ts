import { commands, ExtensionContext, Uri, ViewColumn, Webview, WebviewPanel, window, workspace } from 'vscode';
import { Cfg } from './config.js';
import { CONFIG_ROOT, OPEN_CONFIG_COMMAND, REFRESH_COMMAND } from './commands.js';
import { DEFAULT_STYLES, MARKDOWN_ELEMENTS, MarkdownElement, STYLE_PRESETS } from './markdown-style.js';
import configTemplate from '../webview/config.template.html';

type WebviewStyleMap = Partial<Record<MarkdownElement, Record<string, unknown>>>;

type WebviewMessage = {
  type: 'saveStyles' | 'requestStyles';
  payload?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === 'object' && !Array.isArray(value);
};

const compactObject = (value: unknown): Record<string, unknown> | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }
  const compacted: Record<string, unknown> = {};
  Object.entries(value).forEach(([key, entry]) => {
    if (entry === null || entry === undefined) {
      return;
    }
    if (isRecord(entry)) {
      const nested = compactObject(entry);
      if (nested && Object.keys(nested).length > 0) {
        compacted[key] = nested;
      }
      return;
    }
    compacted[key] = entry;
  });
  return Object.keys(compacted).length > 0 ? compacted : undefined;
};

const readStyles = (): WebviewStyleMap => {
  const raw = Cfg.get<Record<string, unknown>>('styles', {});
  const styles: WebviewStyleMap = {};
  MARKDOWN_ELEMENTS.forEach((element) => {
    const value = raw[element];
    const compacted = compactObject(value);
    if (compacted) {
      styles[element] = compacted;
    }
  });
  return styles;
};

const parseMessage = (value: unknown): WebviewMessage | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }
  if (value.type !== 'saveStyles' && value.type !== 'requestStyles') {
    return undefined;
  }
  return {
    type: value.type,
    payload: value.payload,
  };
};

const sanitizeStyles = (value: unknown): WebviewStyleMap | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }
  const styles: WebviewStyleMap = {};
  MARKDOWN_ELEMENTS.forEach((element) => {
    const entry = value[element];
    const compacted = compactObject(entry);
    if (compacted) {
      styles[element] = compacted;
    }
  });
  return styles;
};

const toInlineJson = (value: unknown) => {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
};

const makeNonce = () => `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;

const renderWebview = (webview: Webview, styles: WebviewStyleMap) => {
  const nonce = makeNonce();
  const csp = [
    "default-src 'none'",
    `img-src ${webview.cspSource} https: data:`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `script-src 'nonce-${nonce}'`,
  ].join('; ');

  return configTemplate
    .replace('__CSP__', csp)
    .replace('__NONCE__', nonce)
    .replace('__MARKDOWN_ELEMENTS__', toInlineJson(MARKDOWN_ELEMENTS))
    .replace('__DEFAULT_STYLES__', toInlineJson(DEFAULT_STYLES))
    .replace('__STYLE_PRESETS__', toInlineJson(STYLE_PRESETS))
    .replace('__INITIAL_STYLES__', toInlineJson(styles));
};

const postCurrentStyles = (panel: WebviewPanel) => {
  return panel.webview.postMessage({
    type: 'syncStyles',
    payload: readStyles(),
  });
};

export const registerConfigPanel = (context: ExtensionContext) => {
  let panel: WebviewPanel | undefined;

  const openPanel = () => {
    if (panel) {
      panel.reveal(ViewColumn.Active);
      void postCurrentStyles(panel);
      return;
    }

    panel = window.createWebviewPanel(
      `${CONFIG_ROOT}.config`,
      'Colorful Markdown Config',
      ViewColumn.Active,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      },
    );
    panel.iconPath = {
      light: Uri.joinPath(context.extensionUri, 'assets', 'config-gear-light.svg'),
      dark: Uri.joinPath(context.extensionUri, 'assets', 'config-gear-dark.svg'),
    };

    panel.webview.html = renderWebview(panel.webview, readStyles());

    panel.onDidDispose(
      () => {
        panel = undefined;
      },
      null,
      context.subscriptions,
    );

    panel.webview.onDidReceiveMessage(
      async (message) => {
        if (!panel) {
          return;
        }
        const parsed = parseMessage(message);
        if (!parsed) {
          return;
        }

        if (parsed.type === 'requestStyles') {
          await postCurrentStyles(panel);
          return;
        }

        const styles = sanitizeStyles(parsed.payload);
        if (!styles) {
          await panel.webview.postMessage({
            type: 'saveResult',
            ok: false,
            message: 'Payload is invalid. Expected a style object map.',
          });
          return;
        }

        try {
          await Cfg.update('styles', styles);
          await commands.executeCommand(REFRESH_COMMAND);
          await panel.webview.postMessage({
            type: 'saveResult',
            ok: true,
            payload: readStyles(),
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          await panel.webview.postMessage({
            type: 'saveResult',
            ok: false,
            message,
          });
        }
      },
      null,
      context.subscriptions,
    );
  };

  context.subscriptions.push(
    commands.registerCommand(OPEN_CONFIG_COMMAND, openPanel),
    workspace.onDidChangeConfiguration((event) => {
      if (!panel || !event.affectsConfiguration(CONFIG_ROOT)) {
        return;
      }
      void postCurrentStyles(panel);
    }),
  );
};
