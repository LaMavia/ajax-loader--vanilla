interface Page {
  href: string
  cache: string | null
}
interface LoaderSettings {
  baseURL: string
  pages: Page[]
  prefix: string
  output: HTMLElement
  errorURL: string
}
declare function AsyncLoader({}:LoaderSettings): string;