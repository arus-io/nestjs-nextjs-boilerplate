const formatPhone = (phone) => {
  if (!phone || typeof phone !== 'string' || phone instanceof String) {
    return null;
  }
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
};

module.exports = formatPhone;
