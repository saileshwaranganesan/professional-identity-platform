/*
 * MetaSeo Component
 *
 * Client-side SEO metadata injector for page title, meta description,
 * OpenGraph, Twitter card, canonical URL, and JSON-LD Person schema.
 */

import { useEffect } from 'react'

export interface MetaSeoProps {
  title: string
  description: string
  canonicalUrl?: string | undefined
  ogImage?: string | undefined
  personData?: {
    name: string
    headline?: string | undefined
    jobTitle?: string | undefined
    url?: string | undefined
    image?: string | undefined
    sameAs?: string[] | undefined
  } | undefined
}

export function MetaSeo({
  title,
  description,
  canonicalUrl,
  ogImage,
  personData,
}: MetaSeoProps) {
  useEffect(() => {
    document.title = title

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // OpenGraph
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', title)

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.setAttribute('content', description)

    if (ogImage) {
      let ogImg = document.querySelector('meta[property="og:image"]')
      if (!ogImg) {
        ogImg = document.createElement('meta')
        ogImg.setAttribute('property', 'og:image')
        document.head.appendChild(ogImg)
      }
      ogImg.setAttribute('content', ogImage)
    }

    if (canonicalUrl) {
      let linkCanonical = document.querySelector('link[rel="canonical"]')
      if (!linkCanonical) {
        linkCanonical = document.createElement('link')
        linkCanonical.setAttribute('rel', 'canonical')
        document.head.appendChild(linkCanonical)
      }
      linkCanonical.setAttribute('href', canonicalUrl)
    }

    // JSON-LD Person Schema
    if (personData) {
      const scriptId = 'json-ld-person-schema'
      let jsonLdScript = document.getElementById(scriptId) as HTMLScriptElement | null
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script')
        jsonLdScript.id = scriptId
        jsonLdScript.type = 'application/ld+json'
        document.head.appendChild(jsonLdScript)
      }

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: personData.name,
        jobTitle: personData.headline || personData.jobTitle || 'Software Engineer',
        url: personData.url || window.location.href,
        image: personData.image || undefined,
        sameAs: personData.sameAs || [],
      }

      jsonLdScript.textContent = JSON.stringify(schema)
    }
  }, [title, description, canonicalUrl, ogImage, personData])

  return null
}
