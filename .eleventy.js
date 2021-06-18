const path = require('path')
const Image = require("@11ty/eleventy-img")

async function imageShortcode(src, alt, cls) {
  let sizes = "(min-width: 1024px) 100vw, 50vw"
  let srcPrefix = `./src/images/`
  src = srcPrefix + src
  console.log(`Generating image(s) from:  ${src}`)
  if(alt === undefined) {
    // Throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`)
  }
  let metadata = await Image(src, {
    widths: [640, 960, 1440],
    formats: ["avif", "webp", "jpeg"],
    urlPath: "/images/",
    outputDir: "./_site/images/",
    /* =====
    Now we'll make sure each resulting file's name will 
    make sense to you. **This** is why you need 
    that `path` statement mentioned earlier.
    ===== */
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src)
      const name = path.basename(src, extension)
      return `${name}-${width}w.${format}`
    }
  })  
  let lowsrc = metadata.jpeg[0]  
  return `<picture>
    ${Object.values(metadata).map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`
    }).join("\n")}
    <img
      src="${lowsrc.url}"
      width="${lowsrc.width}"
      height="${lowsrc.height}"
      alt="${alt}"
      class="${cls}"
      loading="lazy"
      decoding="async">
  </picture>`
}

module.exports = (config) => {
  config.addPassthroughCopy({ 'public': './' })
  config.addPassthroughCopy('./src/images')

  config.addCollection("works", function (collection) {
    const coll = collection.getFilteredByTag("works")

    for (let i = 0; i < coll.length; i++) {
      const prevPost = coll[i - 1]
      const nextPost = coll[i + 1]

      coll[i].data["prevPost"] = prevPost
      coll[i].data["nextPost"] = nextPost
    }

    return coll
  })

  config.addNunjucksAsyncShortcode("image", imageShortcode)

  config.setTemplateFormats("html, md, njk")
  config.setBrowserSyncConfig({
    files: ['_site/**/*'],
    open: true,
    // Tweak for Turbolinks & Browserstack Compatibility
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match;
        }
      }
    }
  })
  config.setDataDeepMerge(true)

  return {
    dir: {
      input: 'src',
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",

    passthroughFileCopy: true,
  }
}
