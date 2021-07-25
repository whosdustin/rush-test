import * as slugify from 'slugify'

export default class Post {
  constructor(title, body) {
    this.title = title
    this.body = body
    this.slug = slugify(title, {
      strict: true,
      lower: true
    })
  }
}