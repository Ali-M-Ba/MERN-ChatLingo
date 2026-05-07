export const logger = (req, res, next) => {
  console.log({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
  next();
};
