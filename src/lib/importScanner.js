function readAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, 'i'));
  return match?.[1] || '';
}

function decodeHtml(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(value = '') {
  return decodeHtml(value.replace(/<[^>]+>/g, ' '));
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toText(value) {
  if (!value) return '';
  if (typeof value === 'string') return stripTags(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') return toText(value.name || value.text || value.url || value['@id']);
  return '';
}

function absoluteUrl(value, sourceUrl) {
  if (!value) return '';
  try {
    return new URL(value, sourceUrl).toString();
  } catch {
    return value;
  }
}

function extractMeta(html, sourceUrl) {
  const meta = {};
  const metaRegex = /<meta\s+[^>]*>/gi;
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

  if (titleMatch) meta.title = stripTags(titleMatch[1]);

  for (const tag of html.match(metaRegex) || []) {
    const key = readAttribute(tag, 'property') || readAttribute(tag, 'name');
    const content = decodeHtml(readAttribute(tag, 'content'));
    if (!key || !content) continue;

    if (key === 'og:title' || key === 'twitter:title') meta.title = meta.title || content;
    if (key === 'og:description' || key === 'description' || key === 'twitter:description') {
      meta.description = meta.description || content;
    }
    if (key === 'og:image' || key === 'twitter:image') meta.image = meta.image || absoluteUrl(content, sourceUrl);
    if (key === 'og:url') meta.url = meta.url || absoluteUrl(content, sourceUrl);
  }

  return meta;
}

function parseJsonLd(html) {
  const blocks = [];
  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match = scriptRegex.exec(html);

  while (match) {
    const raw = match[1]
      .replace(/<!--/g, '')
      .replace(/-->/g, '')
      .trim();

    try {
      blocks.push(JSON.parse(raw));
    } catch {
      // Ignore invalid JSON-LD. Many social pages ship partial or escaped data.
    }

    match = scriptRegex.exec(html);
  }

  return blocks;
}

function flattenJsonLd(value, output = []) {
  if (!value) return output;

  if (Array.isArray(value)) {
    value.forEach((item) => flattenJsonLd(item, output));
    return output;
  }

  if (typeof value !== 'object') return output;

  output.push(value);
  flattenJsonLd(value['@graph'], output);
  flattenJsonLd(value.mainEntity, output);
  flattenJsonLd(value.itemListElement, output);

  return output;
}

function hasType(node, expectedTypes) {
  const types = asArray(node?.['@type']).map((type) => String(type).toLowerCase());
  return expectedTypes.some((expected) => types.includes(expected.toLowerCase()));
}

function firstByType(nodes, expectedTypes) {
  return nodes.find((node) => hasType(node, expectedTypes));
}

function slugify(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function extractDate(value) {
  if (!value) return '';
  const text = String(value);
  const isoDate = text.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  return isoDate || '';
}

function extractTime(value) {
  if (!value) return '';
  const text = String(value);
  return text.match(/T(\d{2}:\d{2})/)?.[1] || text.match(/\b(\d{2}:\d{2})\b/)?.[1] || '';
}

function normalizeLocation(location) {
  if (!location) return '';
  if (typeof location === 'string') return stripTags(location);

  const address = location.address;
  const addressText = typeof address === 'string'
    ? address
    : [address?.streetAddress, address?.addressLocality, address?.addressRegion]
      .filter(Boolean)
      .join(', ');

  return [location.name, addressText].filter(Boolean).join(', ');
}

function normalizeImages(value, fallbackImage, sourceUrl) {
  const images = asArray(value)
    .map((item) => (typeof item === 'object' ? item.url || item.contentUrl : item))
    .filter(Boolean)
    .map((item) => absoluteUrl(String(item), sourceUrl));

  if (fallbackImage) images.push(fallbackImage);

  return [...new Set(images)].slice(0, 3);
}

function normalizeEventDraft(node, meta, sourceUrl) {
  const startDate = node?.startDate || node?.doorTime || '';
  const performers = asArray(node?.performer || node?.subEvent?.performer || node?.organizer)
    .map(toText)
    .filter(Boolean);
  const offer = asArray(node?.offers)[0];
  const price = offer?.price || offer?.lowPrice || offer?.name || '';
  const currency = offer?.priceCurrency ? `${offer.priceCurrency} ` : '';
  const name = toText(node?.name) || meta.title || '';

  return {
    name,
    slug: slugify(name),
    date: extractDate(startDate) ? [extractDate(startDate)] : [],
    time: extractTime(startDate),
    location: normalizeLocation(node?.location),
    link: absoluteUrl(node?.url || meta.url || sourceUrl, sourceUrl),
    htm: price ? `${currency}${price}` : '',
    category: '',
    photoUrls: normalizeImages(node?.image, meta.image, sourceUrl),
    guestSuggestions: [...new Set(performers)],
    description: toText(node?.description) || meta.description || '',
  };
}

function normalizeIdolDraft(node, meta, sourceUrl) {
  const sameAs = asArray(node?.sameAs)
    .map((item) => absoluteUrl(String(item), sourceUrl))
    .filter(Boolean);
  const name = toText(node?.name) || meta.title || '';

  return {
    name,
    slug: slugify(name),
    description: toText(node?.description) || meta.description || '',
    imageUrl: normalizeImages(node?.image || node?.logo, meta.image, sourceUrl)[0] || '',
    sosmeds: [...new Set([node?.url, ...sameAs].filter(Boolean).map((item) => absoluteUrl(item, sourceUrl)))],
    memberSuggestions: [],
    categoryId: '',
  };
}

function scoreDraft(draft, type, foundStructuredData) {
  const eventFields = ['name', 'date', 'time', 'location', 'link', 'photoUrls'];
  const idolFields = ['name', 'description', 'imageUrl', 'sosmeds'];
  const fields = type === 'event' ? eventFields : idolFields;
  const filled = fields.filter((field) => {
    const value = draft[field];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  }).length;

  return Math.min(98, 25 + filled * 12 + (foundStructuredData ? 18 : 0));
}

function validatePublicUrl(url) {
  const parsed = new URL(url);
  const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
  const host = parsed.hostname.toLowerCase();

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('URL harus memakai http atau https');
  }

  if (
    blockedHosts.includes(host) ||
    host.endsWith('.local') ||
    host.startsWith('10.') ||
    host.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  ) {
    throw new Error('URL private/internal tidak boleh discan');
  }

  return parsed.toString();
}

export async function scanImportUrl(url, type = 'event') {
  const sourceUrl = validatePublicUrl(url);
  const response = await fetch(sourceUrl, {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'user-agent': 'MuchitsujoImportScanner/1.0',
    },
    redirect: 'follow',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Gagal fetch URL (${response.status})`);
  }

  const html = await response.text();
  const meta = extractMeta(html, sourceUrl);
  const nodes = flattenJsonLd(parseJsonLd(html));
  const expectedTypes = type === 'idol'
    ? ['MusicGroup', 'PerformingGroup', 'Organization', 'Person']
    : ['Event'];
  const structuredNode = firstByType(nodes, expectedTypes) || {};
  const draft = type === 'idol'
    ? normalizeIdolDraft(structuredNode, meta, sourceUrl)
    : normalizeEventDraft(structuredNode, meta, sourceUrl);

  return {
    ok: true,
    type,
    sourceUrl,
    confidence: scoreDraft(draft, type, Boolean(structuredNode?.['@type'])),
    draft,
    foundTypes: nodes
      .flatMap((node) => asArray(node?.['@type']))
      .filter(Boolean)
      .slice(0, 8),
    warnings: structuredNode?.['@type']
      ? []
      : ['Tidak menemukan JSON-LD sesuai tipe. Draft dibuat dari title/meta tag saja.'],
  };
}
