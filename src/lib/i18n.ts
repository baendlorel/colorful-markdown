import { env } from 'vscode';

const zh = {
  'css-found': 'CSS文件找到了: $0',
};

const en: typeof zh = {
  'css-found': 'Found CSS file at: $0',
};

const dict = env.language.startsWith('en') ? en : zh;

export const i18n = (key: keyof typeof dict, ...args: string[]) => {
  let str = dict[key] || key;
  args.forEach((arg, index) => (str = str.replace(`$${index}`, arg)));
  return str;
};
