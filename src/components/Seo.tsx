import { Head } from 'vite-react-ssg'
import { canonical } from '../lib/seo'
import { SITE_URL, site } from '../data/content'

type JsonLd = Record<string, unknown>

/**
 * Per-route SEO head: unique title, description, canonical and Open Graph tags,
 * plus optional JSON-LD structured data. A single static <title> in index.html
 * is not enough — every route needs its own metadata for SEO and social sharing.
 */
export default function Seo({
  title,
  description = site.tagline,
  path = '',
  image = `${SITE_URL}/logo.svg`,
  noindex = false,
  jsonLd,
}: {
  title: string
  description?: string
  path?: string
  image?: string
  noindex?: boolean
  jsonLd?: JsonLd | JsonLd[]
}) {
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`
  const url = canonical(path)
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="he_IL" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Head>
  )
}
