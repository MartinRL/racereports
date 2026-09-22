// @ts-ignore
import lightboxScript from "./scripts/lightbox.inline"
import lightboxStyle from "./styles/lightbox.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Lightbox: QuartzComponent = (_props: QuartzComponentProps) => {
  return (
    <div id="lightbox-overlay">
      <img id="lightbox-img" src="" alt="" />
    </div>
  )
}

Lightbox.afterDOMLoaded = lightboxScript
Lightbox.css = lightboxStyle

export default (() => Lightbox) satisfies QuartzComponentConstructor
