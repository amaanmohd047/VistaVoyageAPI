class ApiResponse {
  constructor(status, data, message, results = 1) {
    this.status = status;
    this.success = status < 400;
    this.message = status < 400 ? message || "success" : "failed";
    this.error = status > 400 ? message : null;
    this.results = results;
    this.data = data;
  }
}

module.exports = ApiResponse;
