function addRoles(user, context, callback) {
  let accessTokenClaims = context.accessToken || {};
  const assignedRoles = (context.authorization || {}).roles;
  accessTokenClaims[`https://roles`] = assignedRoles;
  user.user_metadata = user.user_metadata || {};
  accessTokenClaims[`https://userId`] = user.user_metadata.id;
  context.accessToken = accessTokenClaims;
  return callback(null, user, context);
}