function setupLightbox() {
  const overlay = document.getElementById("lightbox-overlay") as HTMLDivElement
  const img = document.getElementById("lightbox-img") as HTMLImageElement
  if (!overlay || !img) return

  function openLightbox(src: string, alt: string) {
    img.src = src
    img.alt = alt
    overlay.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  function closeLightbox() {
    overlay.classList.remove("active")
    document.body.style.overflow = ""
    img.src = ""
  }

  overlay.addEventListener("click", closeLightbox)
  window.addCleanup(() => overlay.removeEventListener("click", closeLightbox))

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") closeLightbox()
  }
  document.addEventListener("keydown", handleKeydown)
  window.addCleanup(() => document.removeEventListener("keydown", handleKeydown))

  const article = document.querySelector("article")
  if (!article) return

  const images = article.querySelectorAll("img")
  for (const image of images) {
    image.style.cursor = "zoom-in"
    const handler = () => openLightbox(image.src, image.alt || "")
    image.addEventListener("click", handler)
    window.addCleanup(() => image.removeEventListener("click", handler))
  }
}

document.addEventListener("nav", setupLightbox)
