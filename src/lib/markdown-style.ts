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

export type StylePresetId = 'one-dark' | 'github-cool' | 'ayu-soft';

export type StylePreset = {
  id: StylePresetId;
  label: string;
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
    color: '#c8ccd4',
    fontweight: '700',
    outline: '1px solid #3e4451',
    borderRadius: '3px',
  },
  heading1: { color: '#e06c75', fontweight: '800' },
  heading2: { color: '#d19a66', fontweight: '780' },
  heading3: { color: '#e5c07b', fontweight: '760' },
  heading4: { color: '#98c379', fontweight: '740' },
  heading5: { color: '#61afef', fontweight: '720' },
  heading6: { color: '#c678dd', fontweight: '700' },
  blockquote: {
    color: '#56b6c2',
    decoration: 'underline wavy #56b6c266',
    before: {
      contentText: '| ',
      color: '#56b6c2aa',
    },
  },
  list: { color: '#d19a66' },
  bold: { color: '#e06c75', fontweight: '700' },
  italic: {
    color: '#98c379',
    decoration: 'underline dotted #98c37966',
    fontstyle: 'italic',
  },
  strikethrough: { color: '#be5046', decoration: 'line-through' },
  link: { color: '#61afef', decoration: 'underline' },
  inlineCode: {
    color: '#e5c07b',
    background: '#2c313a',
    fontweight: '600',
    border: '1px solid #3e4451',
    borderRadius: '4px',
  },
  codeFence: {
    color: '#abb2bf',
    background: '#21252b',
    border: '1px solid #3e4451',
  },
});

const GITHUB_COOL_STYLES = createPresetStyles({
  heading: {
    color: '#57606a',
    fontweight: '700',
    outline: '1px solid #d0d7de',
    borderRadius: '3px',
  },
  heading1: { color: '#0a3069', fontweight: '800' },
  heading2: { color: '#0550ae', fontweight: '780' },
  heading3: { color: '#0969da', fontweight: '760' },
  heading4: { color: '#1f6feb', fontweight: '740' },
  heading5: { color: '#218bff', fontweight: '720' },
  heading6: { color: '#54aeff', fontweight: '700' },
  blockquote: {
    color: '#57606a',
    decoration: 'underline wavy #57606a66',
    before: {
      contentText: '| ',
      color: '#8c959faa',
    },
  },
  list: { color: '#0969da' },
  bold: { color: '#24292f', fontweight: '700' },
  italic: {
    color: '#1f6feb',
    decoration: 'underline dotted #1f6feb66',
    fontstyle: 'italic',
  },
  strikethrough: { color: '#6e7781', decoration: 'line-through' },
  link: { color: '#0969da', decoration: 'underline' },
  inlineCode: {
    color: '#0550ae',
    background: '#eaeef2',
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

const AYU_SOFT_STYLES = createPresetStyles({
  heading: {
    color: '#cbccc6',
    fontweight: '700',
    outline: '1px solid #5c677388',
    borderRadius: '3px',
  },
  heading1: { color: '#ffad66', fontweight: '800' },
  heading2: { color: '#ffd580', fontweight: '780' },
  heading3: { color: '#bae67e', fontweight: '760' },
  heading4: { color: '#95e6cb', fontweight: '740' },
  heading5: { color: '#73d0ff', fontweight: '720' },
  heading6: { color: '#d4bfff', fontweight: '700' },
  blockquote: {
    color: '#95e6cb',
    decoration: 'underline wavy #95e6cb66',
    before: {
      contentText: '| ',
      color: '#95e6cbaa',
    },
  },
  list: { color: '#ffd580' },
  bold: { color: '#ffad66', fontweight: '700' },
  italic: {
    color: '#bae67e',
    decoration: 'underline dotted #bae67e66',
    fontstyle: 'italic',
  },
  strikethrough: { color: '#f28779', decoration: 'line-through' },
  link: { color: '#73d0ff', decoration: 'underline' },
  inlineCode: {
    color: '#ffd580',
    background: '#1f2430',
    fontweight: '600',
    border: '1px solid #5c6773',
    borderRadius: '4px',
  },
  codeFence: {
    color: '#cbccc6',
    background: '#242936',
    border: '1px solid #5c6773',
  },
});

export const STYLE_PRESETS: readonly StylePreset[] = [
  {
    id: 'one-dark',
    label: 'One Dark Colorful',
    styles: ONE_DARK_STYLES,
  },
  {
    id: 'github-cool',
    label: 'GitHub Cool',
    styles: GITHUB_COOL_STYLES,
  },
  {
    id: 'ayu-soft',
    label: 'Ayu Soft',
    styles: AYU_SOFT_STYLES,
  },
];
