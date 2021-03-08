const getFileExtension = (path) => {
  const basename = path.split(/[\\/]/).pop();
  const dotPos = basename.lastIndexOf('.');

  if (basename === '' || dotPos < 1) {
    return '';
  }

  return basename.slice(dotPos + 1);
};

module.exports = getFileExtension;
