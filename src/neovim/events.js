import Enum from 'es6-enum'

export const UIEventType = Enum(
  'ATTACH_SCREEN'
);

export function attachScreen(...args) {
  return {
    type: UIEventType.ATTACH_SCREEN,
    args: args
  };
}
