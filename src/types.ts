export type BlogArchiveNode = {
  uid?: string;
  name: string;
  children?: BlogArchiveNode[];
}

export type Post = {
  alternate_languages: Array<any>
  data: {
    body: Array<{
      type: string
      text: string
      spans: Array<any>
      direction: string
    }>
    brands: Array<{
      brand: string
    }>
    date: string
    image: {
      alt: string
      copyright: string | null
      dimensions: {
        width: number
        height: number
      }
      edit: {
        x: number
        y: number
        zoom: number
        background: string
      }
      id: string
      url: string
    }
    product_types: Array<{
      product_type: string
    }>
    products: Array<{
      product: {
        first_publication_date: string
        id: string
        isBroken: boolean
        key: string
        lang: string
        last_publication_date: string
        link_type: string
        slug: string
        tags: Array<string>
        type: string
      }
    }>
    summary: Array<{
      type: string
      text: string
      spans: Array<any>
      direction: string
    }>
    title: Array<{
      type: string
      text: string
      spans: Array<any>
      direction: string
    }>
  }
  first_publication_date: string
  href: string
  id: string
  lang: string
  last_publication_date: string
  linked_documents: Array<any>
  slugs: Array<string>
  tags: Array<string>
  type: string
  uid: string
  url: string | null
}
