import { serviceUrl } from "/lib/xp/portal";
import { forceArray } from "/lib/arrays";
import type { Request, Response } from "@enonic-types/core";

export function responseProcessor(req: Request, res: Response): Response {
  const manifestServiceUrl = serviceUrl({
    service: "manifest",
  });

  res.pageContributions = res.pageContributions ?? {};
  res.pageContributions.headBegin = forceArray(res.pageContributions.headBegin).concat(
    `<link rel="manifest" href="${manifestServiceUrl}/manifest.json" />`,
  );

  return res;
}
