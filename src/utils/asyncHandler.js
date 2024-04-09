
function firstAsyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function secondAsyncHandler(fn) {
  return function (req, res, next) {
    (async () => {
      try {
        await fn(req, res, next);
      } catch (err) {
        next(err);
      }
    })();
  };
}

function thirdAsyncHandler(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch((err) => next(err));

exports.firstAsyncHandler = firstAsyncHandler;
exports.secondAsyncHandler = secondAsyncHandler;
exports.thirdAsyncHandler = thirdAsyncHandler;

module.exports = asyncHandler;





