# Colorful Markdown

Color markdown elements in VS Code with configurable styles.

## Features

- Works in the markdown editor (real-time)
- Supports these elements:
  - `heading`
  - `blockquote`
  - `list`
  - `bold`
  - `italic`
  - `strikethrough`
  - `link`
  - `inlineCode`
  - `codeFence`
- Every element supports:
  - `background`
  - `color`
  - `decoration`
  - `fontweight`

## Command

- `Colorful Markdown: Refresh Markdown Colors`

## Settings

```json
{
  "colorful-markdown.enabled": true,
  "colorful-markdown.styles": {
    "heading": {
      "color": "#ff7f50",
      "fontweight": "800"
    },
    "blockquote": {
      "color": "#6aa6ff",
      "decoration": "underline wavy #6aa6ff66"
    },
    "inlineCode": {
      "background": "#1f1f1f66",
      "color": "#9ef01a",
      "fontweight": "600"
    }
  }
}
```

## Development

```bash
pnpm install
pnpm check
pnpm build
```

Press `F5` in VS Code to launch an Extension Development Host.
