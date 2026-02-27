export const MARKDOWN_ELEMENTS = [
  'heading',
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'blockquote',
  'list',
  'bold',
  'italic',
  'strikethrough',
  'link',
  'inlineCode',
  'codeFence',
] as const;

export type MarkdownElement = (typeof MARKDOWN_ELEMENTS)[number];

export type MarkdownStyle = {
  background?: string;
  color?: string;
  decoration?: string;
  fontweight?: string;
  fontstyle?: string;
  border?: string;
  borderColor?: string;
  borderRadius?: string;
  borderStyle?: string;
  borderWidth?: string;
  borderSpacing?: string;
  outline?: string;
  outlineColor?: string;
  outlineStyle?: string;
  outlineWidth?: string;
  opacity?: string;
  letterSpacing?: string;
  gutterIconPath?: string;
  gutterIconSize?: string;
  isWholeLine?: boolean;
  before?: MarkdownAttachmentStyle;
  after?: MarkdownAttachmentStyle;
};

export type MarkdownAttachmentStyle = {
  contentText?: string;
  contentIconPath?: string;
  border?: string;
  borderColor?: string;
  color?: string;
  background?: string;
  fontweight?: string;
  fontstyle?: string;
  decoration?: string;
  margin?: string;
  width?: string;
  height?: string;
};

export type StylePresetMode = 'dark' | 'light';

export type StylePresetId =
  | 'one-dark'
  | 'one-light'
  | 'github-dark'
  | 'github-light'
  | 'ayu-dark'
  | 'ayu-light';

export type StylePreset = {
  id: StylePresetId;
  label: string;
  mode: StylePresetMode;
  styles: Readonly<Record<MarkdownElement, MarkdownStyle>>;
};

const createEmptyStyles = (): Record<MarkdownElement, MarkdownStyle> => {
  const styles = {} as Record<MarkdownElement, MarkdownStyle>;
  MARKDOWN_ELEMENTS.forEach((element) => {
    styles[element] = {};
  });
  return styles;
};

const createPresetStyles = (
  overrides: Partial<Record<MarkdownElement, MarkdownStyle>>,
): Readonly<Record<MarkdownElement, MarkdownStyle>> => {
  const styles = createEmptyStyles();
  (Object.keys(overrides) as MarkdownElement[]).forEach((element) => {
    const incoming = overrides[element];
    if (!incoming) {
      return;
    }
    styles[element] = incoming;
  });
  return styles;
};

export const DEFAULT_STYLES: Readonly<Record<MarkdownElement, MarkdownStyle>> = createEmptyStyles();

const ONE_DARK_STYLES = createPresetStyles({
  heading: {
    color: '#f3bb7a',
    fontweight: '700',
    outline: '1px solid #3f4657',
    borderRadius: '3px',
  },
  heading1: { color: '#ffbe7a', fontweight: '820' },
  heading2: { color: '#fdbd79', fontweight: '800' },
  heading3: { color: '#f7bc78', fontweight: '780' },
  heading4: { color: '#f2bb77', fontweight: '760' },
  heading5: { color: '#ecba76', fontweight: '740' },
  heading6: { color: '#e6b975', fontweight: '720' },
  blockquote: {
    color: '#7fb7c5',
    background: '#2a3342',
    borderRadius: '4px',
    before: {
      contentText: '| ',
      color: '#7fb7c5cc',
    },
  },
  list: { color: '#d19a66' },
  bold: { color: '#ff7a90', fontweight: '700' },
  italic: {
    color: '#98c379',
    decoration: 'underline dotted #98c37966',
    fontstyle: 'italic',
  },
  strikethrough: { color: '#f7768e', decoration: 'line-through' },
  link: { color: '#61afef', decoration: 'underline' },
  inlineCode: {
    color: '#e5c07b',
    background: '#2b313f',
    fontweight: '600',
    border: '1px solid #434c5e',
    borderRadius: '4px',
  },
  codeFence: {
    color: '#c8d3f5',
    background: '#1f2430',
    border: '1px solid #434c5e',
  },
});

const ONE_LIGHT_STYLES = createPresetStyles({
  heading: {
    color: '#b56c22',
    fontweight: '700',
    outline: '1px solid #d8dee9',
    borderRadius: '3px',
  },
  heading1: { color: '#bf6e24', fontweight: '820' },
  heading2: { color: '#bc6d27', fontweight: '800' },
  heading3: { color: '#b96c2a', fontweight: '780' },
  heading4: { color: '#b66b2d', fontweight: '760' },
  heading5: { color: '#b36a30', fontweight: '740' },
  heading6: { color: '#b06933', fontweight: '720' },
  blockquote: {
    color: '#2f6f8a',
    background: '#edf4fb',
    borderRadius: '4px',
    before: {
      contentText: '| ',
      color: '#2f6f8acc',
    },
  },
  list: { color: '#b65c00' },
  bold: { color: '#c43e1d', fontweight: '700' },
  italic: {
    color: '#2f8f5b',
    decoration: 'underline dotted #2f8f5b66',
    fontstyle: 'italic',
  },
  strikethrough: { color: '#a2405e', decoration: 'line-through' },
  link: { color: '#0969da', decoration: 'underline' },
  inlineCode: {
    color: '#8250df',
    background: '#eef2ff',
    fontweight: '600',
    border: '1px solid #d0d7de',
    borderRadius: '4px',
  },
  codeFence: {
    color: '#24292f',
    background: '#f6f8fa',
    border: '1px solid #d0d7de',
  },
});

const GITHUB_DARK_STYLES = createPresetStyles({
  heading: {
    color: '#77befa',
    fontweight: '700',
    outline: '1px solid #30363d',
    borderRadius: '3px',
  },
  heading1: { color: '#7cc4ff', fontweight: '820' },
  heading2: { color: '#7ac1fc', fontweight: '800' },
  heading3: { color: '#78bef9', fontweight: '780' },
  heading4: { color: '#76bbf6', fontweight: '760' },
  heading5: { color: '#74b8f3', fontweight: '740' },
  heading6: { color: '#72b5f0', fontweight: '720' },
  blockquote: {
    color: '#9ca7b2',
    background: '#1f2733',
    borderRadius: '4px',
    before: {
      contentText: '| ',
      color: '#9ca7b2cc',
    },
  },
  list: { color: '#ffa657' },
  bold: { color: '#ff7b72', fontweight: '700' },
  italic: {
    color: '#7ee787',
    decoration: 'underline dotted #7ee78766',
    fontstyle: 'italic',
  },
  strikethrough: { color: '#8b949e', decoration: 'line-through' },
  link: { color: '#58a6ff', decoration: 'underline' },
  inlineCode: {
    color: '#79c0ff',
    background: '#21262d',
    fontweight: '600',
    border: '1px solid #30363d',
    borderRadius: '4px',
  },
  codeFence: {
    color: '#c9d1d9',
    background: '#161b22',
    border: '1px solid #30363d',
  },
});

const GITHUB_LIGHT_STYLES = createPresetStyles({
  heading: {
    color: '#0b68d4',
    fontweight: '700',
    outline: '1px solid #d0d7de',
    borderRadius: '3px',
  },
  heading1: { color: '#055fc9', fontweight: '820' },
  heading2: { color: '#0964cd', fontweight: '800' },
  heading3: { color: '#0d69d1', fontweight: '780' },
  heading4: { color: '#116ed5', fontweight: '760' },
  heading5: { color: '#1573d9', fontweight: '740' },
  heading6: { color: '#1978dd', fontweight: '720' },
  blockquote: {
    color: '#5d6672',
    background: '#eef4fb',
    borderRadius: '4px',
    before: {
      contentText: '| ',
      color: '#8c959fcc',
    },
  },
  list: { color: '#bc4c00' },
  bold: { color: '#cf222e', fontweight: '700' },
  italic: {
    color: '#116329',
    decoration: 'underline dotted #11632966',
    fontstyle: 'italic',
  },
  strikethrough: { color: '#6e7781', decoration: 'line-through' },
  link: { color: '#0969da', decoration: 'underline' },
  inlineCode: {
    color: '#8250df',
    background: '#f6f8fa',
    fontweight: '600',
    border: '1px solid #d0d7de',
    borderRadius: '4px',
  },
  codeFence: {
    color: '#24292f',
    background: '#f6f8fa',
    border: '1px solid #d8dee4',
  },
});

const AYU_DARK_STYLES = createPresetStyles({
  heading: {
    color: '#fcb56d',
    fontweight: '700',
    outline: '1px solid #5c677388',
    borderRadius: '3px',
  },
  heading1: { color: '#ffb869', fontweight: '820' },
  heading2: { color: '#feb76b', fontweight: '800' },
  heading3: { color: '#fdb66d', fontweight: '780' },
  heading4: { color: '#fcb56f', fontweight: '760' },
  heading5: { color: '#fbb471', fontweight: '740' },
  heading6: { color: '#fab373', fontweight: '720' },
  blockquote: {
    color: '#93d9c2',
    background: '#2a3140',
    borderRadius: '4px',
    before: {
      contentText: '| ',
      color: '#93d9c2cc',
    },
  },
  list: { color: '#ffcc66' },
  bold: { color: '#ffad66', fontweight: '700' },
  italic: {
    color: '#bae67e',
    decoration: 'underline dotted #bae67e66',
    fontstyle: 'italic',
  },
  strikethrough: { color: '#f28779', decoration: 'line-through' },
  link: { color: '#59c2ff', decoration: 'underline' },
  inlineCode: {
    color: '#ffd173',
    background: '#232834',
    fontweight: '600',
    border: '1px solid #5c6773',
    borderRadius: '4px',
  },
  codeFence: {
    color: '#cccac2',
    background: '#1f2430',
    border: '1px solid #5c6773',
  },
});

const AYU_LIGHT_STYLES = createPresetStyles({
  heading: {
    color: '#b4720d',
    fontweight: '700',
    outline: '1px solid #d6dae5',
    borderRadius: '3px',
  },
  heading1: { color: '#ba760f', fontweight: '820' },
  heading2: { color: '#b67811', fontweight: '800' },
  heading3: { color: '#b27a13', fontweight: '780' },
  heading4: { color: '#ae7c15', fontweight: '760' },
  heading5: { color: '#aa7e17', fontweight: '740' },
  heading6: { color: '#a68019', fontweight: '720' },
  blockquote: {
    color: '#4b7282',
    background: '#f4f7fd',
    borderRadius: '4px',
    before: {
      contentText: '| ',
      color: '#4b7282cc',
    },
  },
  list: { color: '#b88a00' },
  bold: { color: '#c76a00', fontweight: '700' },
  italic: {
    color: '#4a8d43',
    decoration: 'underline dotted #4a8d4366',
    fontstyle: 'italic',
  },
  strikethrough: { color: '#b25555', decoration: 'line-through' },
  link: { color: '#2f6ab0', decoration: 'underline' },
  inlineCode: {
    color: '#7d59c4',
    background: '#f3f5fa',
    fontweight: '600',
    border: '1px solid #d6dae5',
    borderRadius: '4px',
  },
  codeFence: {
    color: '#334155',
    background: '#f5f7fb',
    border: '1px solid #d6dae5',
  },
});

export const STYLE_PRESETS: readonly StylePreset[] = [
  {
    id: 'one-dark',
    label: 'One Dark Colorful',
    mode: 'dark',
    styles: ONE_DARK_STYLES,
  },
  {
    id: 'github-dark',
    label: 'GitHub Dark Rich',
    mode: 'dark',
    styles: GITHUB_DARK_STYLES,
  },
  {
    id: 'ayu-dark',
    label: 'Ayu Dark Pastel',
    mode: 'dark',
    styles: AYU_DARK_STYLES,
  },
  {
    id: 'one-light',
    label: 'One Light Colorful',
    mode: 'light',
    styles: ONE_LIGHT_STYLES,
  },
  {
    id: 'github-light',
    label: 'GitHub Light Cool',
    mode: 'light',
    styles: GITHUB_LIGHT_STYLES,
  },
  {
    id: 'ayu-light',
    label: 'Ayu Light Pastel',
    mode: 'light',
    styles: AYU_LIGHT_STYLES,
  },
];
