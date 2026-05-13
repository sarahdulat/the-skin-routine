import { createPrismic } from "@prismicio/vue"
import type { Router, RouteLocationNormalizedLoaded } from "vue-router"

export { }

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $prismic: ReturnType<typeof createPrismic>
    $router: Router
    $route: RouteLocationNormalizedLoaded
  }
}
