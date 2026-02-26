import {
  commands,
  DecorationRenderOptions,
  ExtensionContext,
  Range,
  TextDocument,
  TextEditor,
  TextEditorDecorationType,
  window,
  workspace,
} from 'vscode';
import { Cfg } from './lib/config.js';

type MarkdownElement =
  | 'heading'
  | 'blockquote'
  | 'list'
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'link'
  | 'inlineCode'
  | 'codeFence';

type MarkdownStyle = {
  background?: string;
  color?: string;
  decoration?: string;
  fontweight?: string;
};

const MARKDOWN_RULES: Readonly<Record<MarkdownElement, RegExp>> = {
  heading: /^#{1,6}[ \t]+.*$/gm,
  blockquote: /^>+[ \t]?.*$/gm,
  list: /^[ \t]*(?:[-+*]|\d+\.)[ \t]+.*$/gm,
  bold: /\*\*[^*\n]+\*\*|__[^_\n]+__/g,
  italic: /(?<!\*)\*[^*\n]+\*(?!\*)|(?<!_)_[^_\n]+_(?!_)/g,
  strikethrough: /~~[^~\n]+~~/g,
  link: /\[[^\]\n]+\]\([^)]+\)/g,
  inlineCode: /`[^`\n]+`/g,
  codeFence: /```[\s\S]*?```/g,
};

const DEFAULT_STYLES: Readonly<Record<MarkdownElement, MarkdownStyle>> = {
  heading: { color: '#ff7f50', fontweight: '700' },
  blockquote: { color: '#6aa6ff', decoration: 'underline wavy #6aa6ff66' },
  list: { color: '#ffd166' },
  bold: { color: '#ff4d6d', fontweight: '700' },
  italic: { color: '#2ec4b6', decoration: 'underline dotted #2ec4b655' },
  strikethrough: { color: '#f28482', decoration: 'line-through' },
  link: { color: '#4cc9f0', decoration: 'underline' },
  inlineCode: { color: '#9ef01a', background: '#1f1f1f66', fontweight: '600' },
  codeFence: { color: '#caf0f8', background: '#0b254566' },
};

const CONFIG_ROOT = 'colorful-markdown';
const REFRESH_COMMAND = `${CONFIG_ROOT}.refreshStyles`;

const readString = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const mergeStyle = (base: MarkdownStyle, incoming: unknown): MarkdownStyle => {
  if (!incoming || typeof incoming !== 'object') {
    return base;
  }
  const style = incoming as Record<string, unknown>;
  return {
    background: readString(style.background) ?? base.background,
    color: readString(style.color) ?? base.color,
    decoration: readString(style.decoration) ?? base.decoration,
    fontweight: readString(style.fontweight) ?? readString(style.fontWeight) ?? base.fontweight,
  };
};

const toDecorationRenderOptions = (style: MarkdownStyle): DecorationRenderOptions => ({
  backgroundColor: style.background,
  color: style.color,
  fontWeight: style.fontweight,
  textDecoration: style.decoration,
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
    (Object.keys(DEFAULT_STYLES) as MarkdownElement[]).forEach((key) => {
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
    (Object.keys(styles) as MarkdownElement[]).forEach((key) => {
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
    (Object.keys(MARKDOWN_RULES) as MarkdownElement[]).forEach((element) => {
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
};
