import { createPrismic } from "@prismicio/vue"

export { }

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $prismic: ReturnType<typeof createPrismic>
  }
}
