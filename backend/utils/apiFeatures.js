class APIFeatures {
  constructor(query, queryStr) {
    this.query = query
    this.queryStr = queryStr
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i',
          },
        }
      : {}
    this.query = this.query.find({ ...keyword })
    return this
  }

  filter() {
    let queryCopy = { ...this.queryStr }

    //Remove fields from query
    const removeFields = ['keyword', 'limit', 'page']
    removeFields.forEach((el) => delete queryCopy[el])

    //Filter for price and rating
    let queryStr = JSON.stringify(queryCopy)

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/gi, (match) => `$${match}`)

    let parsedStr = JSON.parse(queryStr)

    const searchTerm = parsedStr.category
      ? {
          ...parsedStr,
          category: {
            $regex: parsedStr.category,
            $options: 'i',
          },
        }
      : parsedStr

    this.query = this.query.find({ ...searchTerm })
    return this
  }

  pagination(resultPerPage) {
    const page = this.queryStr.page || 1
    const skip = resultPerPage * (page - 1)

    this.query = this.query.limit(resultPerPage).skip(skip)
    return this
  }
}

module.exports = APIFeatures
