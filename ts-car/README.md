# ts-car

## Requisitos
- Node.js >= 20.0

## Instalación

El proyecto puede ejecutarse directamente al descargar el archivo `dist.zip` desde [*Releases*](https://github.com/msilenzi/ts-car/releases/), descomprimir el archivo y abrir `index.html`.

En caso de querer trabajar con el código fuente:

1. Instalar las dependencias
    - Node.js y NPM. En caso de no tenerlo instalado recomiendo usar [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) (disponible para cualquier SO).

2. Clonar el repositorio
    ```bash
    git clone https://github.com/msilenzi/ts-car.git
    cd ts-car
    ```

3. Instalar las dependencias
    ```bash
    npm install
    ```

4. Ejecutar la aplicación
    ```bash
    npm run dev
    ```
   Este comando crea un servidor local en la PC y solo se puede acceder desde él. En caso de querer hacer pública la aplicación en la red local (por ejemplo, para usarla desde otro dispositivo) podés ejecutar `npm run dev -- --host`.


## Estructura del proyecto

```
.
├── index.html
├── main.ts
├── package.json
└── src/
    ├── GamepadController/
    │   ├── GamepadAxes.ts
    │   ├── GamepadButtons.ts
    │   └── GamepadController.ts
    ├── CarController/
    │   ├── AbstractCarController.ts
    │   ├── BasicCarController.ts
    │   ├── AdvancedCarController.ts
    │   └── mappers.ts
    └── ui/
        ├── form.ts
        ├── connectionStatus.ts
        ├── controllerStatus.ts
        └── latency.ts

```

### `GamepadController/`

Las clases definidas dentro de esta carpeta no deberían ser modificadas.

Esta carpeta contiene las clases necesarias para manejar los componentes de un gamepad. Provee una abstracción para *Gamepad API*, permitiendo manejar distintos tipos de controles de forma sencilla.

- **`GamepadComponent.ts`:** clase abstracta que representa a un conjunto de componentes genéricos, como los stick o los botones. Define métodos y propiedades comunes para gestionar el estado de los componentes.

- **`GamepadButtons.ts`:** clase concreta que se encarga de manejar los botones de un gamepad.

- **`GamepadAxes.ts`:** clase concreta que se encarga de manejar los ejes (sticks) de un gamepad.

- **`GamepadController.ts`:** representa al controlador de un gamepad. **Esta es la clase que se debería utilizar como base para definir un nuevo controlador.** Cuenta con los siguientes métodos:
    - `constructor(gamepadIndex, gamepadButtons, gamepadAxes)`: recibe el índice en el que se encuentra el gamepad que se quiere controlar e instancias de las clases GamepadButtons y GamepadAxes, que serán utilizadas para verificar el estado del control.
    - `start()`: comienza un timer que hace polling sobre el estado del control e invoca al método `handleStatusUpdated()` en caso de haber un cambio significativo en las entradas del mismo.
    - `stop()`: finaliza el polling sobre el control. Pone todas las entradas en 0 y llama a `handleStatusUpdated()` por última vez.
    - `getStatus()`: devuelve el estado de todas las entradas del control que están siendo mapeadas.
    - `handleStatusUpdated(status): void`: es un método gancho que se invoca automáticamente cuando ocurre un cambio significativo en las entradas del control. **Este método es el único que debería definirse si se quiere crear un nuevo control específico.** Recibe como parámetro un objeto con las entradas que fueron actualizadas desde la última actualización (este parámetro es pasado automáticamente por el método `start()` cuando lo invoca.


### `CarController/`

Contiene clases y configuración que permiten la interacción entre un control y el auto.

La clase `AbstractCarController` extiende de la clase `GamepadController` y 

- **`AbstractCarController.ts`:** define una clase abstracta de igual nombre que sirve como base para los controladores específicos. Hereda de `GamepadControler` y define los mapeos y tipos que deben utilizar sus subclases.
- **`BasicCarController.ts`:** contiene una clase que extiende de `AbstractCarController` y proporciona un controlador básico para el auto. El controlador solo sabe enviar los mensajes 'adelante', 'atrás', 'izquierda', 'derecha', 'parar'. Esta clase es útil para trabajar con el volante. 
- **`AdvancedCarController.ts`:** también extiende de `AbstractCarController`, pero envía un estado completo al gamepad a través de una petición POST. En lugar de solo girar o acelerar podemos controlar que tanto queremos que lo haga. Esta clase es útil para trabajar con un mando.
- **`mappers.ts`:** contiene configuraciones de mapeo del tipo `CarMapper` (definido en `AbstractCarController.ts`) para diferentes tipos de controles, como el mando de Xbox o el volante. Estos mapeos definen qué botones y ejes del gamepad se utilizarán para enviar instrucciones específicas al auto.


### `ui/`

Contiene diferentes archivos que se encargan de gestionar partes específicas
de la interfaz. La idea es evitar que el resto de módulos conozcan al DOM y que
realicen todos los cambios necesarios llamando a las funciones definidas en
estos archivos.

Cada módulo (archivo) se encarga de controlar una parte específica de la interfaz y si necesita modificar otra debería hacerlo llamando a una función del módulo correspondiente. 


### `main.ts`

Programa principal.
