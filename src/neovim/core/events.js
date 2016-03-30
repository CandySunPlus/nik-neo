import Enum from 'enum'

export const UIEventType = new Enum(['ATTACH_SCREEN']);

export function attachScreen(...args) {
  return {
    type: UIEventType.ATTACH_SCREEN,
    args: args
  };
}
