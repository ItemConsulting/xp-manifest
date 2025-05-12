import type { Content } from "@enonic-types/core";

export type Unarray<T> = T extends Array<infer U> ? U : T extends ReadonlyArray<infer U> ? U : T;

// Built in
export type BaseMedia<Media extends object = BaseMediaConfig> = {
  media: Media;
  caption?: string;
  artist?: string | string[];
  copyright?: string;
  tags?: string | string[];
};

export interface BaseMediaConfig {
  attachment: string;
}

export type Image = BaseMedia<ImageConfig> & {
  altText?: string;
};

export type ImageConfig = {
  attachment: string;
  focalPoint: {
    x: number;
    y: number;
  };
  zoomPosition: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  cropPosition: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    zoom: number;
  };
};

export type ContentImage = Content<Image, "media:image">;
export type ContentVector = Content<BaseMedia, "media:vector">;
