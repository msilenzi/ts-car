export const xboxButtonMapper = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  BUMPER_LEFT: 4,
  BUMPER_RIGHT: 5,
  TRIGGER_LEFT: 6,
  TRIGGER_RIGHT: 7,
  BUTTON_VIEW: 8,
  BUTTON_MENU: 9,
  THUMBSTICK_L_CLICK: 10,
  THUMBSTICK_R_CLICK: 11,
  D_PAD_UP: 12,
  D_PAD_DOWN: 13,
  D_PAD_LEFT: 14,
  D_PAD_RIGHT: 15,
  BUTTON_HOME: 16,
}

export const xboxAxesMapper = {
  LEFT_THUMBSTICK: { x: 0, y: 1 },
  RIGHT_THUMBSTICK: { x: 2, y: 3 },
}

export type XboxButtonMapper = typeof xboxButtonMapper
export type XboxAxesMapper = typeof xboxAxesMapper
