import Color from 'color-js'

export const colors = {
  aqua: new Color('#24b2a1'),
  slate: new Color('#363945'),
  lightGray: new Color('#efefef'),
  silver: new Color('#9c9c9c')
}

colors.darkSlate = colors.slate.darkenByRatio(0.15)

colors.input = {
  text: colors.slate,
  label: 'rgba(0, 0, 0, 0.4)',
  focused: new Color('#408CF5'),
  error: '#C21913',
  border: 'rgba(0, 0, 0, 0.3)',
  background: 'rgba(255, 255, 255, 0.95)',
  backgroundFocused: 'rgba(255, 255, 255, 1)'
}

colors.button = {
  background: colors.aqua,
  backgroundHover: colors.aqua.lightenByRatio(0.04),
  backgroundPressed: colors.aqua.darkenByRatio(0.06)
}

colors.button.secondary = {
  background: colors.silver,
  backgroundHover: colors.silver.lightenByRatio(0.04),
  backgroundPressed: colors.silver.darkenByRatio(0.04)
}

colors.switch = {
  background: 'rgba(0, 0, 0, 0.4)'
}

colors.switch.knob = {
  background: colors.lightGray
}

colors.switchActive = {
  background: colors.aqua,
  border: colors.aqua.darkenByRatio(0.5)
}
