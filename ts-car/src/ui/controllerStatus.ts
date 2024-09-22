const $controllerStatus: HTMLPreElement =
  document.querySelector('#controllerStatus')!

export function setControllerStatus(status: string) {
  $controllerStatus.innerText = status
}

export function setEmptyControllerStatus() {
  $controllerStatus.innerText = '{ none }'
}
