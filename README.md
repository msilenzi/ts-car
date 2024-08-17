# ts-car

Dentro de este repositorio hay dos proyectos:

- **gamepadtest-master:** es una página web HTML muy simple que puede usarse para ver fácilmente los índices de los botones del control conectado.
- **ts-car:**

## Gamepad API

Los proyectos de este repositorio se ejecutan en el navegador y utilizan **Gamepad API** para interactuar con los controles. [**Gamepad API**](https://developer.mozilla.org/es/docs/Web/API/Gamepad_API) es una interfaz proporcionada por los navegadores para acceder a la información de los controles y procesar las entradas del usuario.

Para ver más sobre como funciona *Gamepad API* recomiendo [esta página (Using the Gamepad API - MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API). A continuación dejo un resumen con los contenidos más importantes:

### Detectar controles conectados

Cuando se **conecta** un control a la computadora, la página recibe un evento **`gamepadconnected`**. Si el control ya estaba conectado cuando se cargó la página, entonces el evento `gamepadconnected` se dispara cuando se presiona un botón o se mueve un eje.

```javascript
window.addEventListener("gamepadconnected", (e) => {
  console.log(
    "Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index,
    e.gamepad.id,
    e.gamepad.buttons.length,
    e.gamepad.axes.length,
  );
});
```

Cuando se **desconecta** un control, y si la página había recibido previamente datos para ese control (por ejemplo, un evento `gamepadconnected`), se envía el evento **`gamepaddisconnected`**.

```javascript
window.addEventListener("gamepaddisconnected", (e) => {
  console.log(
    "Gamepad disconnected from index %d: %s",
    e.gamepad.index,
    e.gamepad.id,
  );
});
```

La propiedad `gamepad.index` es única por cada dispositivo conectado al sistema, incluso si se utilizan varios controles del mismo tipo. Esta propiedad también funciona como índice en el array devuelto por `navigator.getGamepads()` (a continuación hablaremos al respecto).

### Consultando el estado de un control

Los eventos de gamepad incluyen como parte del objeto del evento (`e`) la propiedad `gamepad`. Esta propiedad es una instancia de [`Gamepad`](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad) y podemos usarla para ver el estado actual del dispositivo. Sin embargo, este valor no se actualiza automáticamente y para obtener los valores más recientes del control tenemos que volver a consultarlos usando `navigator.getGamepads()`.

El método **`navigator.getGamepads()`** siempre devuelve un array con 4 elementos. Cada uno de estos elementos es un dispositivo actualmente visible en la página web (representado como una instancia de `Gamepad`) o `null` en caso de que no haya un dispositivo visible en esa posición. Si no hay ningún dispositivo visible, entonces los 4 elementos valen `null`.

### La clase `Gamepad`

Una instancia de [**`Gamepad`**](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad) contiene las siguientes propiedades:

- **`id`:** un string que contiene alguna información sobre el control, como el nombre del producto y el fabricante. Si bien se llama *id*, esta propiedad no sirve como identificador, ya que dos mandos del mismo modelo podrían tener el mismo id. Su valor es útil para mostrárselo al usuario. Por ejemplo mi control de Xbox tiene el siguiente id en Firefox: *"045e-0b12-Microsoft Xbox Series S|X Controller"*.

- **`index`:** un entero que es único para cada control actualmente conectado al sistema. Puede ser usado para distinguir entre múltiples controles y se corresponde con el índice que el control ocupa en el array devuelto por `navigator.getGamepads()`. Es importante tener en cuenta que desconectar un dispositivo y luego conectar uno nuevo puede reutilizar el índice anterior.

- **`buttons`:** un array de instancias de [**`GamepadButton`**](https://developer.mozilla.org/en-US/docs/Web/API/GamepadButton) que representa los botones del control. Cada instancia de `GamepadButton` tiene las siguientes propiedades:
  - **`pressed`:** es un booleano que indica si el botón está siendo presionado (`true`) o no (`false`).
  - **`value`:** es un número de punto flotante con un valor entre 0.0 y 1.0, donde 0.0 es un botón que no está siendo presionado y 1.0 es un botón que está completamente presionado. En los botones analógicos, como los gatillos (R2 y L2 en PlayStation o RT y LT en Xbox) este valor varía dentro de este rango, mientras que, para el resto de los botones, su valor es 0 cuando no está presionado y 1 cuando lo está.

- **`axes`:** un array que representa los ejes del dispositivo (por ejemplo, los sticks). Cada valor del array es un número de punto flotante entre el rango -1.0 y 1.0; donde -1.0 es el valor más bajo, 0.0 es el valor cuando no está siendo accionado y 1.0 es el valor más alto. Por ejemplo, cada stick de un mando de Xbox tiene dos valores en este array (uno para el eje horizontal y otro para el eje vertical) dando un total de 4 elementos (dos para el stick izquierdo y dos para el stick derecho).

- **`mapping`**

- **`connected`**

- **`timestamp`**

### Algunas consideraciones acerca de *Gamepad API*
- Por razones de seguridad, ***Gamepad API* solo actualiza el estado de los controles cuando la página es visible al usuario**. Esto implica que, si minimizamos la ventana donde se está ejecutando nuestra aplicación o la superponemos completamente por otra ventana, entonces se dejarán de actualizar las entradas del control.

### Código de ejemplo

Este es un código de ejemplo muy simple para usar un control:

```javascript
let interval = null

function gamepadHandler(gamepadIndex) {
  // Obtener la información del gamepad
  const gp = navigator.getGamepads()[gamepadIndex]

  console.log('buttons', gp.buttons.map(b => b.value.toFixed(2)))
  console.log('axes', gp.axes.map(a => a.toFixed(2)))
  console.log('')
}

window.addEventListener('gamepadconnected', (e) => {
  // Si ya hay un control conectado finaliza
  if (interval != null) return

  console.log('"%s" connected', e.gamepad.id)
  interval = setInterval(() => gamepadHandler(e.gamepad.index), 50)
})

window.addEventListener('gamepaddisconnected', (e) => {
  clearInterval(interval)
  interval = null
})
```
