export const LAYOUT_CONFIG = {
  sidebar: {
    defaultWidth: 480,
    minWidth: 350,
    maxWidth: 600,
  },

  chatbot: {
    defaultWidth: 360,
    minWidth: 280,
    maxWidth: 600,
  },

  dataDetail: {
    defaultWidth: 360,
    minWidth: 280,
    maxWidth: 600,
  },
} as const

export type LayoutConfig = typeof LAYOUT_CONFIG
