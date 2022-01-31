export default function checkAdmindomain(req) {
  return process.env.ADMIN_URL === req.headers.origin;
}
