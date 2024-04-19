class ApiResponse {
  constructor(status, data, message, results = 1) {
    this.statusCode = status;
    this.status = status < 400 ? "success" : status < 500 ? "failed" : "error";
    this.success = status < 400;
    this.message = message || "";
    this.error = status > 400 ? message : null;
    this.results = results;
    this.data = data;
  }
}

module.exports = ApiResponse;
