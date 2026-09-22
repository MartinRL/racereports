import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  // ponytail: 404s land on the CV instead of a dead end
  const cvUrl = "https://chronograph.rosenlidholm.se/cv"

  return (
    <article class="popover-hint">
      <script dangerouslySetInnerHTML={{ __html: `window.location.replace("${cvUrl}")` }} />
      <h1>404</h1>
      <p>{i18n(cfg.locale).pages.error.notFound}</p>
      <a href={cvUrl}>{i18n(cfg.locale).pages.error.home}</a>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
