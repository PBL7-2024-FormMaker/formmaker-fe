export const ElementActions = {
  Delete: 'Delete',
  Setting: 'Setting',
};

export type ElementActionKeys =
  (typeof ElementActions)[keyof typeof ElementActions];
