/*
  Return a gql formatted date
*/
export const formatDateGql = (o: Record<string, any>, field: string) => {
  if (o[field] && !(o[field] instanceof Date)) return new Date(o[field]);
  return o[field];
};
