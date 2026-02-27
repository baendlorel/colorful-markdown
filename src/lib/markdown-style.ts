export const MARKDOWN_ELEMENTS = [
  'heading',
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

export const DEFAULT_STYLES: Readonly<Record<MarkdownElement, MarkdownStyle>> = {
  heading: {
    color: '#ff7f50',
    fontweight: '700',
    outline: '1px solid #ff7f5033',
    borderRadius: '3px',
  },
  blockquote: { color: '#6aa6ff', decoration: 'underline wavy #6aa6ff66' },
  list: { color: '#ffd166' },
  bold: { color: '#ff4d6d', fontweight: '700' },
  italic: { color: '#2ec4b6', decoration: 'underline dotted #2ec4b655', fontstyle: 'italic' },
  strikethrough: { color: '#f28482', decoration: 'line-through' },
  link: { color: '#4cc9f0', decoration: 'underline' },
  inlineCode: {
    color: '#9ef01a',
    background: '#1f1f1f66',
    fontweight: '600',
    border: '1px solid #9ef01a55',
    borderRadius: '4px',
  },
  codeFence: { color: '#caf0f8', background: '#0b254566', border: '1px solid #caf0f833' },
};
