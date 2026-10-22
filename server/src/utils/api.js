function asyncHandler(fn) { return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next); }
function sendSuccess(res, data = {}, status = 200) { return res.status(status).json({ success: true, ...data }); }
module.exports = { asyncHandler, sendSuccess };
