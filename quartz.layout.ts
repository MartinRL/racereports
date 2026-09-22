import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// NOTE: This function is serialized via .toString() and rebuilt in the browser
// with `new Function(...)`, so it must be self-contained — no references to
// outer-scope variables (they will be undefined at runtime in the explorer).
const explorerSortFn = (
  a: { slugSegment: string; displayName: string; isFolder: boolean },
  b: { slugSegment: string; displayName: string; isFolder: boolean },
) => {
  // Folders (language sections) before files
  if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1

  // Race reports are slugged <event>-<year>: newest year first
  const yearOf = (s: string) => Number(/-(\d{4})$/.exec(s)?.[1] ?? 0)
  if (yearOf(a.slugSegment) !== yearOf(b.slugSegment)) {
    return yearOf(b.slugSegment) - yearOf(a.slugSegment)
  }

  // Date-named entries (YYYY-MM-DD files, YYYY-MM month folders) sort in
  // reverse chronological order. Match against slugSegment (the filename)
  // rather than displayName (which is the frontmatter title and may be
  // prefixed, e.g. "Daily D4 Digest — 2026-05-15").
  const isoDateRegex = /^\d{4}-\d{2}(-\d{2})?$/
  if (isoDateRegex.test(a.slugSegment) && isoDateRegex.test(b.slugSegment)) {
    return b.slugSegment.localeCompare(a.slugSegment)
  }

  // Default: alphabetical
  return a.displayName.localeCompare(b.displayName, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.Lightbox()],
  footer: Component.Footer({
    links: {
      "Martin Rosén-Lidholm": "https://rosenlidholm.se",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.AuthorInfo({
      name: "Martin Rosén-Lidholm",
      portraitPath: "/static/mrl-portrait.jpg",
      linkedinUrl: "https://www.linkedin.com/in/martin-rosen-lidholm/",
    }),
    Component.TagList(),
  ],
  left: [
    Component.DesktopOnly(Component.PageTitle()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      sortFn: explorerSortFn,
      // Deep-link-only pages: hidden from the sidebar tree, still reachable
      // via direct URL and search. Serialized via .toString() like sortFn,
      // so it must stay self-contained.
      filterFn: (node) => !["tags", "bilder"].includes(node.slugSegment),
    }),
    Component.DesktopOnly(Component.Graph()),
  ],
  right: [Component.DesktopOnly(Component.TableOfContents()), Component.Backlinks()],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.DesktopOnly(Component.PageTitle()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      sortFn: explorerSortFn,
      // Deep-link-only pages: hidden from the sidebar tree, still reachable
      // via direct URL and search. Serialized via .toString() like sortFn,
      // so it must stay self-contained.
      filterFn: (node) => !["tags", "bilder"].includes(node.slugSegment),
    }),
  ],
  right: [],
}
