import { SITE_URL, site, telHref } from '../data/content'
import type { Product } from './types'

// Builds an absolute canonical URL for a given route path.
export function canonical(path = ''): string {
  if (!path || path === '/') return SITE_URL
  return SITE_URL + (path.startsWith('/') ? path : `/${path}`)
}

// JSON-LD: Organization — one per site (rendered on the homepage).
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description: site.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address,
      addressCountry: 'IL',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: telHref.replace('tel:', ''),
      email: site.email,
      contactType: 'sales',
      areaServed: 'IL',
      availableLanguage: ['he'],
    },
  }
}

// JSON-LD: BreadcrumbList — for deeper pages with a clear hierarchy.
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: canonical(it.path),
    })),
  }
}

// JSON-LD: Product — only on product-detail pages.
export function productLd(product: Product) {
  const additionalProperty = Object.entries(product.specs ?? {}).map(([name, value]) => ({
    '@type': 'PropertyValue',
    name,
    value: String(value),
  }))
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name_he,
    description: product.short_desc_he ?? product.description_he ?? site.tagline,
    image: product.image_url ?? `${SITE_URL}/logo.svg`,
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'Tiandy' },
    url: canonical(`/products/${product.slug}`),
    ...(additionalProperty.length ? { additionalProperty } : {}),
  }
}
