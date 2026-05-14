// ../core/jupiter/core/infra/field-names.ts
function constructFieldName(namePrefix, fieldName) {
  if (!namePrefix) {
    return fieldName;
  }
  return `${namePrefix}${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
}
function constructFieldErrorName(fieldsPrefix, fieldName) {
  if (!fieldsPrefix) {
    return `/${fieldName}`;
  }
  return `/${fieldsPrefix}_${fieldName}`;
}

export {
  constructFieldName,
  constructFieldErrorName
};
//# sourceMappingURL=/build/_shared/chunk-IYE5HYO4.js.map
