import type { ThemeConfig } from 'antd'

export const appTheme: ThemeConfig = {
  cssVar: { key: 'monochrome-theme' },
  token: {
    borderRadius: 6,
    colorPrimary: '#111111',
    colorPrimaryHover: '#333333',
    colorPrimaryActive: '#000000',
    colorPrimaryBg: '#f0f0f0',
    colorPrimaryBgHover: '#e5e5e5',
    colorPrimaryBorder: '#b3b3b3',
    colorPrimaryBorderHover: '#8c8c8c',
    colorPrimaryText: '#111111',
    colorPrimaryTextHover: '#525252',
    colorPrimaryTextActive: '#000000',
    colorInfo: '#111111',
    colorLink: '#111111',
    colorLinkHover: '#525252',
    colorLinkActive: '#000000',
    colorText: '#282828',
    colorTextHeading: '#111111',
    colorTextSecondary: '#646464',
    colorTextTertiary: '#787878',
    colorTextDisabled: '#a0a0a0',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBorder: '#b3b3b3',
    colorBorderSecondary: '#c4c4c4',
    colorFillAlter: '#fafafa',
    colorBgSpotlight: '#111111',
    colorSuccess: '#333333',
    colorError: '#111111',
    colorWarning: '#555555',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeightStrong: 700
  },
  components: {
    Button: {
      defaultColor: '#111111',
      defaultBorderColor: '#b3b3b3',
      defaultShadow: 'none',
      primaryShadow: 'none'
    },
    Splitter: {
      controlItemBgActive: '#000000',
      controlItemBgActiveHover: '#000000'
    }
  }
}
