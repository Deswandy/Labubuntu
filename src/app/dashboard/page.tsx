import { AppSidebar } from "@/components/app-sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"
import { ClearOAuthCode } from "@/components/dashboard/ClearOAuthCode"


export default function Page() {

  return (
    <section>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <ClearOAuthCode />
              <SectionCards />
            </div>
          </div>
        </div>
    </section>
  )
}
