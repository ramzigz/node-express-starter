function isAdmin(user) {
  if (user?.role === 'ADMIN') {
    return true;
  }
  return false;
}

function isOwner(userId, ressourceId) {
  if (Array.isArray(ressourceId)) {
    if (ressourceId.includes(userId)) return true;
  } else if (String(userId) === String(ressourceId)) {
    return true;
  }
  return false;
}

export { isAdmin, isOwner };
