interface INormalizeRule {
  name: string
  apply: (input: string) => string
}

const normalizeRules: INormalizeRule[] = [
  {
    name: 'ensure-space-before-headings',
    apply: (md) => md.replace(/\n(#+\s)/g, '\n\n$1'),
  },
  {
    name: 'normalize-bullet-spacing',
    apply: (md) => md.replace(/\n-\s*/g, '\n- '),
  },
  {
    name: 'collapse-extra-newlines',
    apply: (md) => md.replace(/\n{3,}/g, '\n\n'),
  },
]

export function normalizeMarkdown(md: string) {
  return normalizeRules.reduce((acc, rule) => rule.apply(acc), md).trim()
}
