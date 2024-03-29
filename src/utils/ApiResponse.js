class ApiResponse {
  constructor(status, data, message = "success") {
    this.data = data;
    this.message = message;
    this.status = status;
    this.success = status < 400;
  }
}

module.exports = ApiResponse;
