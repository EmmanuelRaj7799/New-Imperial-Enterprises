import { useEffect } from 'react';
import { IMAGES } from '../data/businessData';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface PageMetaOptions {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  imageAlt?: string;
  breadcrumbs?: BreadcrumbItem[];
  schema?: Record<string, unknown>;
}

export function usePageMeta({
  title,
  description,
  keywords,
  image = IMAGES.heroFacade,
  imageAlt = 'New Imperial Enterprises architectural aluminium, glass, UPVC and interior craftsmanship',
  breadcrumbs,
  schema,
}: PageMetaOptions) {
  const breadcrumbsJson = breadcrumbs ? JSON.stringify(breadcrumbs) : '';
  const schemaJson = schema ? JSON.stringify(schema) : '';

  useEffect(() => {
    document.title = title;

    const origin = window.location.origin;
    const canonicalUrl = `${origin}${window.location.pathname}`;
    const resolvedImageUrl = image.startsWith('http') ? image : `${origin}${image}`;

    const setMeta = (selector: string, attrName: string, attrValue: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setCanonical = (href: string) => {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    setCanonical(canonicalUrl);
    setMeta('meta[name="description"]', 'name', 'description', description);
    if (keywords) {
      setMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
    }

    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', resolvedImageUrl);
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', imageAlt);

    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', resolvedImageUrl);
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', imageAlt);

    // Dynamic per-route JSON-LD structured data (BreadcrumbList + optional route entity)
    const graph: Record<string, unknown>[] = [];

    if (breadcrumbsJson) {
      const parsedCrumbs = JSON.parse(breadcrumbsJson) as BreadcrumbItem[];
      if (parsedCrumbs.length > 0) {
        graph.push({
          '@type': 'BreadcrumbList',
          itemListElement: parsedCrumbs.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: `${origin}${item.path}`,
          })),
        });
      }
    }

    if (schemaJson) {
      const parsedSchema = JSON.parse(schemaJson) as Record<string, unknown>;
      graph.push({
        ...parsedSchema,
        url: canonicalUrl,
      });
    }

    const existingRouteScript = document.querySelector<HTMLScriptElement>(
      'script[data-route-schema="true"]'
    );
    if (graph.length > 0) {
      const scriptEl = existingRouteScript ?? document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.setAttribute('data-route-schema', 'true');
      scriptEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graph,
      });
      if (!existingRouteScript) {
        document.head.appendChild(scriptEl);
      }
    } else if (existingRouteScript) {
      existingRouteScript.remove();
    }
  }, [title, description, keywords, image, imageAlt, breadcrumbsJson, schemaJson]);
}
