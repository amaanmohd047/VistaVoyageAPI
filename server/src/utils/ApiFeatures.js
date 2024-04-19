class ApiFeatures {
  constructor(queryObject, queryString) {
    this.query = queryObject;
    this.queryString = queryString;
  }

  filter({ excluded }) {
    const queryObj = { ...this.queryString };
    excluded?.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = JSON.parse(
      queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (matchedString) => `$${matchedString}`
      )
    );

    this.query = this.query.find(queryStr);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-ratingsAverage ratingCount -createdAt");
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 8;
    const skipTours = (page - 1) * limit;

    this.query = this.query.skip(skipTours).limit(limit);
    return this;
  }

  fieldLimit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
}

module.exports = ApiFeatures;
