interface LoaderSettings {
  baseURL: string
  pages: string[]
  prefix: string
  output: HTMLElement
  errorURL: string
}
declare function AsyncLoader({}:LoaderSettings): string;