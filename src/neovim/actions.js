import Enum from 'es6-enum'

export const UIActions = Enum(
  'ATTACH_SCREEN'
);

export function attachScreen(...args) {
  return {
    type: UIActions.ATTACH_SCREEN,
    args: args
  };
}
