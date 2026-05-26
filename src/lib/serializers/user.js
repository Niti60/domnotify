function isPlainObject(value) {
  if (!value || typeof value !== 'object') return false;
  return Object.prototype.toString.call(value) === '[object Object]';
}

function serializeValue(value) {
  if (value == null) return value;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Buffer.isBuffer(value)) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value
      .map(serializeValue)
      .filter((item) => item !== undefined);
  }

  if (typeof value === 'object') {
    if (typeof value.toJSON === 'function' && !isPlainObject(value)) {
      const jsonValue = value.toJSON();
      return serializeValue(jsonValue);
    }

    const result = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      if (key === '__v') continue;
      if (nestedValue === undefined) continue;

      const serialized = serializeValue(nestedValue);
      if (serialized !== undefined) {
        result[key] = serialized;
      }
    }
    return result;
  }

  return value;
}

export function serializeUser(user) {
  if (!user) return null;

  const plainUser = isPlainObject(user) ? user : user.toObject?.() ?? user;
  const serialized = serializeValue(plainUser);

  if (!serialized || typeof serialized !== 'object') {
    return null;
  }

  return {
    ...serialized,
    _id: serialized._id?.toString?.() ?? serialized._id ?? null,
    createdAt: serialized.createdAt ? new Date(serialized.createdAt).toISOString() : undefined,
    updatedAt: serialized.updatedAt ? new Date(serialized.updatedAt).toISOString() : undefined,
    lastLogin: serialized.lastLogin ? new Date(serialized.lastLogin).toISOString() : undefined,
    // Keep the client auth payload lightweight and stable.
    password: undefined,
    __v: undefined,
  };
}

export function serializeAuthUser(user) {
  if (!user) return null;

  // Ensure we have a plain object with user properties
  const plainUser = isPlainObject(user) ? user : (user.toObject?.() ?? user);
  
  // For Mongoose documents, directly access fields
  const name = plainUser.name || user.name || null;
  const email = plainUser.email || user.email || null;
  const _id = plainUser._id?.toString?.() ?? plainUser._id ?? user._id?.toString?.() ?? user._id ?? null;
  const role = plainUser.role || user.role || null;
  const isAdmin = Boolean(plainUser.isAdmin ?? user.isAdmin);
  const isPremiumUser = Boolean(plainUser.isPremiumUser ?? user.isPremiumUser);
  const premiumPlanType = plainUser.premiumPlanType ?? user.premiumPlanType ?? null;

  return {
    _id,
    name,
    email,
    role,
    isAdmin,
    isPremiumUser,
    premiumPlanType,
  };
}
