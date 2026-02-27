type ConfigName = 'enabled' | 'styles';
type CommandName = 'refreshStyles' | 'openConfig';

declare module '*.html' {
  const value: string;
  export default value;
}
