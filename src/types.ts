export type BlogArchiveNode = {
  uid?: string;
  name: string;
  children?: BlogArchiveNode[];
}

export type Post = {
  id: string
  uid: string
  url: any
  type: string
  href: string
  tags: Array<string>
  first_publication_date: string
  last_publication_date: string
  slugs: Array<string>
  linked_documents: Array<any>
  lang: string
  alternate_languages: Array<any>
  data: {
    product_image: {
      dimensions: {
        width: number
        height: number
      }
      alt: any
      copyright: any
      url: string
      id: string
      edit: {
        x: number
        y: number
        zoom: number
        background: string
      }
    }
    title: Array<{
      type: string
      text: string
      spans: Array<any>
      direction: string
    }>
    date: string
    brand: string
    product_type: string
    summary: Array<{
      type: string
      text: string
      spans: Array<any>
      direction: string
    }>
    subtitle: Array<{
      type: string
      text: string
      spans: Array<any>
      direction: string
    }>
    body: Array<{
      type: string
      text: string
      spans: Array<any>
      direction: string
    }>
  }
}
