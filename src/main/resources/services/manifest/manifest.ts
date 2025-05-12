import { attachmentUrl, getSite, getSiteConfig, imageUrl, pageUrl } from "/lib/xp/portal";
import { get as getOne } from "/lib/xp/content";
import { forceArray } from "/lib/arrays";
import type { Response } from "@enonic-types/core";
import type { SiteConfig } from "/site/index";
import { Screenshot, WebAppManifest } from "web-app-manifest";
import type { ExternalApplicationResource, ImageResource, ShortcutItem } from "web-app-manifest";
import { ContentImage, ContentVector, Unarray } from "/lib/types";

type Shortcut = Unarray<NonNullable<SiteConfig["shortcuts"]>>;
type RelatedApplication = Unarray<NonNullable<SiteConfig["related_applications"]>>;
type ScreenshotRaw = Unarray<NonNullable<SiteConfig["screenshots"]>>;
type WebAppManifestWithSchema = WebAppManifest & { $schema: string };

const IMAGE_SIZE_ICON = [48, 72, 96, 144, 168, 192];
export function get(): Response {
  const site = getSite<SiteConfig>();
  const siteConfig = getSiteConfig<SiteConfig>();

  if (site && siteConfig) {
    const manifest: WebAppManifestWithSchema = {
      // id (there can be multiple ids on the same domain)
      $schema: "https://json.schemastore.org/web-manifest-combined.json",
      lang: site.language,
      name: siteConfig.name ?? site.displayName,
      short_name: siteConfig.short_name,
      description: siteConfig.description,
      background_color: siteConfig.background_color,
      theme_color: siteConfig.theme_color,
      display: siteConfig.display,
      icons: siteConfig.iconId ? createIcons(siteConfig.iconId) : undefined,
      related_applications: mapAsArray(siteConfig.related_applications, createRelatedApplication),
      shortcuts: mapAsArray(siteConfig.shortcuts, createShortcut),
      categories: siteConfig.categories ? forceArray(siteConfig.categories) : undefined,
      scope: pageUrl({
        path: site._path,
        type: "absolute",
      }),
      // https://developer.mozilla.org/en-US/docs/Web/Manifest/start_url
      start_url: pageUrl({
        path: site._path,
        type: "absolute",
      }),
      screenshots: mapAsArray(siteConfig.screenshots, createScreenshot),
    };

    return {
      status: 200,
      contentType: "application/manifest+json",
      body: JSON.stringify(manifest, null, 2),
    };
  } else {
    return {
      status: 404,
    };
  }
}

function createShortcut(shortcut: Shortcut): ShortcutItem {
  const { name, short_name, description, pageId, iconId } = shortcut;

  return {
    name,
    short_name,
    description,
    url: pageUrl({
      id: pageId,
      type: "absolute",
    }),
    icons: iconId ? createIcons(iconId) : undefined,
  };
}

function createRelatedApplication(relatedApplication: RelatedApplication): ExternalApplicationResource {
  const { platform, url } = relatedApplication;

  return {
    platform,
    url,
  };
}

function createIcons(id: string): ImageResource[] {
  const imageContent = getOne<ContentImage | ContentVector>({ key: id });

  if (!imageContent) {
    return [];
  } else if (imageContent.type === "media:vector") {
    return [
      {
        src: attachmentUrl({
          id: id,
          type: "absolute",
        }),
        sizes: "any",
        purpose: imageContent.data.caption,
      },
    ];
  } else {
    return IMAGE_SIZE_ICON.map((size) => {
      return {
        src: imageUrl({
          id: id,
          format: "png",
          scale: `square(${size})`,
          type: "absolute",
        }),
        type: "image/png",
        sizes: `${size}x${size}`,
        purpose: imageContent.data.caption,
      };
    });
  }
}

const IMAGE_SIZE = {
  wide: "1920x1080",
  narrow: "750x1334",
} as const;

const IMAGE_SCALE = {
  wide: "block(1920, 1080)",
  narrow: "block(750, 1334)",
} as const;

function createScreenshot(screenshot: ScreenshotRaw): Screenshot {
  return {
    src: imageUrl({
      id: screenshot.imageId,
      scale: IMAGE_SCALE[screenshot.form_factor] ?? "full",
      type: "absolute",
    }),
    form_factor: screenshot.form_factor,
    sizes: IMAGE_SIZE[screenshot.form_factor],
  };
}

function mapAsArray<A, B>(data: A | Array<A> | undefined, f: (a: A) => B): Array<B> | undefined {
  return data ? forceArray(data).map<B>(f) : undefined;
}
