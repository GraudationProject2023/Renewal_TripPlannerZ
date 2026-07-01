export interface ValidationError {
  detail: {
    loc: [string, number]
    msg: string
    type: string
  }[]
}
