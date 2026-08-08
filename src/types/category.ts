/**
 * Minimal read model for category pickers (e.g. the product form's
 * category select). Full category CRUD is a separate, later phase -
 * this only supports listing active categories.
 */
export type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};
