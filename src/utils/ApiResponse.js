class ApiResponse {
  constructor(status, data, message = "success", results = 1) {
    this.status = status;
    this.success = status < 400;
    this.message = message;
    this.results = results;
    this.data = data;
  }
}

module.exports = ApiResponse;
