/* eslint-disable @typescript-eslint/no-var-requires */
// json2csv v6-alpha ships without bundled .d.ts; use require to avoid TS module errors
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Parser } = require('json2csv');

// Whitelisted exportable fields matching the actual dataset schema
const FIELD_LABELS: Record<string, string> = {
  id: 'ID',
  date: 'Date',
  amount: 'Amount',
  category: 'Category',
  status: 'Status',
  userName: 'User Name',
  user_id: 'User ID',
  user_profile: 'User Profile URL',
};

const ALLOWED_FIELDS = Object.keys(FIELD_LABELS);

/**
 * Generates a properly escaped CSV string from transaction data.
 * Only includes whitelisted fields; silently ignores unknown field names.
 */
export const generateCsv = (data: object[], requestedFields: string[]): string => {
  const validFields = requestedFields.filter((f) => ALLOWED_FIELDS.includes(f));

  if (validFields.length === 0) {
    throw new Error('No valid fields selected for export');
  }

  const fields = validFields.map((f) => ({ label: FIELD_LABELS[f], value: f }));
  const parser = new Parser({ fields });
  return parser.parse(data) as string;
};
