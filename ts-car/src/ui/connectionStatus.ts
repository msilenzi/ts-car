const $connectionStatus: HTMLSpanElement =
  document.querySelector('#connectionStatus')!

const COLORS = {
  secondary: 'text-secondary',
  success: 'text-success',
  danger: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
}

export function setStatus(color: keyof typeof COLORS, text: string) {
  $connectionStatus.className = COLORS[color]
  $connectionStatus.innerText = text
}
