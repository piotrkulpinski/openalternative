import { adsConfig } from "~/config/ads"
import { dataTableConfig } from "~/config/data-table"
import { linksConfig } from "~/config/links"
import { metadataConfig } from "~/config/metadata"
import { searchConfig } from "~/config/search"
import { siteConfig } from "~/config/site"
import { statsConfig } from "~/config/stats"
import { submissionsConfig } from "~/config/submissions"

export const config = {
  site: siteConfig,
  stats: statsConfig,
  links: linksConfig,
  metadata: metadataConfig,
  ads: adsConfig,
  submissions: submissionsConfig,
  search: searchConfig,
  dataTable: dataTableConfig,
}
