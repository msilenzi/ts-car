const $latency: HTMLSpanElement = document.querySelector('#latencyTime')!

export function setLatency(latencyMs: number) {
  $latency.innerText = latencyMs.toFixed(2).toString()
}

export function setEmptyLatency() {
  $latency.innerText = '---'
}
