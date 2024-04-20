exports.filterRequestObject = (object, ...fields) => {
  const filteredObject = {};
  fields.forEach((field) => {
    if (object[field]) filteredObject[field] = object[field];
  });
  return filteredObject;
};

exports.firstTrace = (err) =>
  err?.stack?.split("at")[1]?.split(">")[1]?.split("(")[1]?.split(")")[0];
