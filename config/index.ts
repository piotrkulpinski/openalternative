import { adsConfig } from "~/config/ads"
import { dataTableConfig } from "~/config/data-table"
import { linksConfig } from "~/config/links"
import { siteConfig } from "~/config/site"
import { statsConfig } from "~/config/stats"
import { submissionsConfig } from "~/config/submissions"

export const config = {
  site: siteConfig,
  stats: statsConfig,
  links: linksConfig,
  ads: adsConfig,
  submissions: submissionsConfig,
  dataTable: dataTableConfig,
}
