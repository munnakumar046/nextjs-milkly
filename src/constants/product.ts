// Pure, dependency-free constants shared by both server code (models,
// services) and client code (the product form's Zod schema). Must never
// import mongoose or anything server-only - that would drag Node-only code
// into the client bundle wherever this is imported.
export const PRODUCT_UNITS = ["ml", "L", "g", "kg", "piece"] as const;
export type ProductUnit = (typeof PRODUCT_UNITS)[number];
