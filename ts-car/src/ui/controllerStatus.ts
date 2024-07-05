const $controllerStatus: HTMLPreElement =
  document.querySelector('#controllerStatus')!

export function setStatus(status: string) {
  $controllerStatus.innerText = status
}

export function setEmptyStatus() {
  $controllerStatus.innerText = '{ none }'
}
