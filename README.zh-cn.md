# Colorful Markdown

一个用于 VS Code 的 Markdown 元素上色插件。

## 功能

- 在 Markdown 编辑器中实时上色
- 支持元素：
  - `heading`
  - `blockquote`
  - `list`
  - `bold`
  - `italic`
  - `strikethrough`
  - `link`
  - `inlineCode`
  - `codeFence`
- 每个元素可配置：
  - `background`
  - `color`
  - `decoration`
  - `fontweight`

## 命令

- `Colorful Markdown: Refresh Markdown Colors`

## 设置示例

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

## 开发

```bash
pnpm install
pnpm check
pnpm build
```

在 VS Code 中按 `F5` 启动 Extension Development Host 调试。
