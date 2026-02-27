import {
  commands,
  DecorationRenderOptions,
  ExtensionContext,
  Range,
  TextDocument,
  TextEditor,
  TextEditorDecorationType,
  ThemableDecorationAttachmentRenderOptions,
  window,
  workspace,
} from 'vscode';
import { Cfg } from './lib/config.js';
import { CONFIG_ROOT, REFRESH_COMMAND } from './lib/commands.js';
import { registerConfigPanel } from './lib/config-panel.js';
import {
  DEFAULT_STYLES,
  MARKDOWN_ELEMENTS,
  MarkdownAttachmentStyle,
  MarkdownElement,
  MarkdownStyle,
} from './lib/markdown-style.js';

const MARKDOWN_RULES: Readonly<Record<MarkdownElement, RegExp>> = {
  heading: /^#{1,6}[ \t]+.*$/gm,
  heading1: /^#[ \t]+.*$/gm,
  heading2: /^##[ \t]+.*$/gm,
  heading3: /^###[ \t]+.*$/gm,
  heading4: /^####[ \t]+.*$/gm,
  heading5: /^#####[ \t]+.*$/gm,
  heading6: /^######[ \t]+.*$/gm,
  blockquote: /^>+[ \t]?.*$/gm,
  list: /^[ \t]*(?:[-+*]|\d+\.)[ \t]+/gm,
  bold: /\*\*[^*\n]+\*\*|__[^_\n]+__/g,
  italic: /(?<!\*)\*[^*\n]+\*(?!\*)|(?<!_)_[^_\n]+_(?!_)/g,
  strikethrough: /~~[^~\n]+~~/g,
  link: /\[[^\]\n]+\]\([^)]+\)/g,
  inlineCode: /`[^`\n]+`/g,
  codeFence: /```[\s\S]*?```/g,
};

const readString = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const readBoolean = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value;
  }
  return undefined;
};

const hasOwn = (target: Record<string, unknown>, key: string) =>
  Object.prototype.hasOwnProperty.call(target, key);

const resolveString = (
  target: Record<string, unknown>,
  keys: string[],
  fallback: string | undefined,
) => {
  for (const key of keys) {
    if (!hasOwn(target, key)) {
      continue;
    }
    if (target[key] === null) {
      return undefined;
    }
    return readString(target[key]);
  }
  return fallback;
};

const resolveBoolean = (
  target: Record<string, unknown>,
  key: string,
  fallback: boolean | undefined,
) => {
  if (!hasOwn(target, key)) {
    return fallback;
  }
  if (target[key] === null) {
    return undefined;
  }
  return readBoolean(target[key]);
};

const mergeAttachmentStyle = (
  base: MarkdownAttachmentStyle | undefined,
  incoming: unknown,
): MarkdownAttachmentStyle | undefined => {
  if (incoming === null) {
    return undefined;
  }
  if (!base && (!incoming || typeof incoming !== 'object')) {
    return undefined;
  }
  const raw = (incoming && typeof incoming === 'object' ? incoming : {}) as Record<string, unknown>;
  const merged: MarkdownAttachmentStyle = {
    contentText: resolveString(raw, ['contentText'], base?.contentText),
    contentIconPath: resolveString(raw, ['contentIconPath'], base?.contentIconPath),
    border: resolveString(raw, ['border'], base?.border),
    borderColor: resolveString(raw, ['borderColor'], base?.borderColor),
    color: resolveString(raw, ['color'], base?.color),
    background: resolveString(raw, ['background', 'backgroundColor'], base?.background),
    fontweight: resolveString(raw, ['fontweight', 'fontWeight'], base?.fontweight),
    fontstyle: resolveString(raw, ['fontstyle', 'fontStyle'], base?.fontstyle),
    decoration: resolveString(raw, ['decoration', 'textDecoration'], base?.decoration),
    margin: resolveString(raw, ['margin'], base?.margin),
    width: resolveString(raw, ['width'], base?.width),
    height: resolveString(raw, ['height'], base?.height),
  };
  return Object.values(merged).some((value) => value !== undefined) ? merged : undefined;
};

const mergeStyle = (base: MarkdownStyle, incoming: unknown): MarkdownStyle => {
  if (!incoming || typeof incoming !== 'object') {
    return base;
  }
  const style = incoming as Record<string, unknown>;
  return {
    background: resolveString(style, ['background', 'backgroundColor'], base.background),
    color: resolveString(style, ['color'], base.color),
    decoration: resolveString(style, ['decoration', 'textDecoration'], base.decoration),
    fontweight: resolveString(style, ['fontweight', 'fontWeight'], base.fontweight),
    fontstyle: resolveString(style, ['fontstyle', 'fontStyle'], base.fontstyle),
    border: resolveString(style, ['border'], base.border),
    borderColor: resolveString(style, ['borderColor'], base.borderColor),
    borderRadius: resolveString(style, ['borderRadius'], base.borderRadius),
    borderStyle: resolveString(style, ['borderStyle'], base.borderStyle),
    borderWidth: resolveString(style, ['borderWidth'], base.borderWidth),
    borderSpacing: resolveString(style, ['borderSpacing'], base.borderSpacing),
    outline: resolveString(style, ['outline'], base.outline),
    outlineColor: resolveString(style, ['outlineColor'], base.outlineColor),
    outlineStyle: resolveString(style, ['outlineStyle'], base.outlineStyle),
    outlineWidth: resolveString(style, ['outlineWidth'], base.outlineWidth),
    opacity: resolveString(style, ['opacity'], base.opacity),
    letterSpacing: resolveString(style, ['letterSpacing'], base.letterSpacing),
    gutterIconPath: resolveString(style, ['gutterIconPath'], base.gutterIconPath),
    gutterIconSize: resolveString(style, ['gutterIconSize'], base.gutterIconSize),
    isWholeLine: resolveBoolean(style, 'isWholeLine', base.isWholeLine),
    before: mergeAttachmentStyle(base.before, style.before),
    after: mergeAttachmentStyle(base.after, style.after),
  };
};

const toAttachmentRenderOptions = (
  style?: MarkdownAttachmentStyle,
): ThemableDecorationAttachmentRenderOptions | undefined => {
  if (!style) {
    return undefined;
  }
  const mapped: ThemableDecorationAttachmentRenderOptions = {
    contentText: style.contentText,
    contentIconPath: style.contentIconPath,
    border: style.border,
    borderColor: style.borderColor,
    color: style.color,
    backgroundColor: style.background,
    fontWeight: style.fontweight,
    fontStyle: style.fontstyle,
    textDecoration: style.decoration,
    margin: style.margin,
    width: style.width,
    height: style.height,
  };
  return Object.values(mapped).some((value) => value !== undefined) ? mapped : undefined;
};

const toDecorationRenderOptions = (style: MarkdownStyle): DecorationRenderOptions => ({
  backgroundColor: style.background,
  color: style.color,
  fontWeight: style.fontweight,
  fontStyle: style.fontstyle,
  textDecoration: style.decoration,
  border: style.border,
  borderColor: style.borderColor,
  borderRadius: style.borderRadius,
  borderStyle: style.borderStyle,
  borderWidth: style.borderWidth,
  borderSpacing: style.borderSpacing,
  outline: style.outline,
  outlineColor: style.outlineColor,
  outlineStyle: style.outlineStyle,
  outlineWidth: style.outlineWidth,
  opacity: style.opacity,
  letterSpacing: style.letterSpacing,
  gutterIconPath: style.gutterIconPath,
  gutterIconSize: style.gutterIconSize,
  isWholeLine: style.isWholeLine,
  before: toAttachmentRenderOptions(style.before),
  after: toAttachmentRenderOptions(style.after),
});

const isMarkdownDocument = (document: TextDocument) =>
  document.languageId === 'markdown' || document.fileName.endsWith('.md');

const collectRanges = (document: TextDocument, rule: RegExp): Range[] => {
  const ranges: Range[] = [];
  const text = document.getText();
  const regex = new RegExp(rule.source, rule.flags);
  for (const match of text.matchAll(regex)) {
    if (match.index === undefined) {
      continue;
    }
    const start = document.positionAt(match.index);
    const end = document.positionAt(match.index + match[0].length);
    ranges.push(new Range(start, end));
  }
  return ranges;
};

class MarkdownColorizer {
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly decorations = new Map<MarkdownElement, TextEditorDecorationType>();

  constructor(private readonly context: ExtensionContext) {
    this.rebuildDecorationTypes();
    this.attachEvents();
    this.refreshVisibleEditors();
  }

  private attachEvents() {
    this.context.subscriptions.push(
      commands.registerCommand(REFRESH_COMMAND, () => {
        this.rebuildDecorationTypes();
        this.refreshVisibleEditors();
      }),
      window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
          this.schedule(editor);
        }
      }),
      window.onDidChangeVisibleTextEditors((editors) => editors.forEach((editor) => this.schedule(editor))),
      workspace.onDidChangeTextDocument((event) => {
        if (!isMarkdownDocument(event.document)) {
          return;
        }
        for (const editor of window.visibleTextEditors) {
          if (editor.document.uri.toString() === event.document.uri.toString()) {
            this.schedule(editor);
          }
        }
      }),
      workspace.onDidChangeConfiguration((event) => {
        if (!event.affectsConfiguration(CONFIG_ROOT)) {
          return;
        }
        Cfg.refresh();
        this.rebuildDecorationTypes();
        this.refreshVisibleEditors();
      }),
      {
        dispose: () => {
          for (const timer of this.timers.values()) {
            clearTimeout(timer);
          }
          this.timers.clear();
          for (const decoration of this.decorations.values()) {
            decoration.dispose();
          }
          this.decorations.clear();
        },
      },
    );
  }

  private isEnabled() {
    return Cfg.get('enabled', true);
  }

  private readStylesConfig() {
    const incoming = Cfg.get<Record<string, unknown>>('styles', {});
    const styles = {} as Record<MarkdownElement, MarkdownStyle>;
    MARKDOWN_ELEMENTS.forEach((key) => {
      styles[key] = mergeStyle(DEFAULT_STYLES[key], incoming[key]);
    });
    return styles;
  }

  private rebuildDecorationTypes() {
    for (const decoration of this.decorations.values()) {
      decoration.dispose();
    }
    this.decorations.clear();
    const styles = this.readStylesConfig();
    MARKDOWN_ELEMENTS.forEach((key) => {
      const decoration = window.createTextEditorDecorationType(toDecorationRenderOptions(styles[key]));
      this.decorations.set(key, decoration);
    });
  }

  private schedule(editor: TextEditor) {
    const id = editor.document.uri.toString();
    const existing = this.timers.get(id);
    if (existing) {
      clearTimeout(existing);
    }
    const timer = setTimeout(() => {
      this.timers.delete(id);
      this.apply(editor);
    }, 60);
    this.timers.set(id, timer);
  }

  private clear(editor: TextEditor) {
    for (const decoration of this.decorations.values()) {
      editor.setDecorations(decoration, []);
    }
  }

  private apply(editor: TextEditor) {
    if (!this.isEnabled() || !isMarkdownDocument(editor.document)) {
      this.clear(editor);
      return;
    }
    MARKDOWN_ELEMENTS.forEach((element) => {
      const decoration = this.decorations.get(element);
      if (!decoration) {
        return;
      }
      const ranges = collectRanges(editor.document, MARKDOWN_RULES[element]);
      editor.setDecorations(decoration, ranges);
    });
  }

  private refreshVisibleEditors() {
    for (const editor of window.visibleTextEditors) {
      this.schedule(editor);
    }
  }
}

export default (context: ExtensionContext) => {
  new MarkdownColorizer(context);
  registerConfigPanel(context);
};
