/* global document */
const colors = require('../constants/colors');

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('STYLE');
  const setCss = (cssText) => {
    styleElement.innerHTML = cssText;
  };

  document.getElementsByTagName('HEAD')[0].appendChild(styleElement);

  document.addEventListener('mousedown', () => {
    setCss('*:focus{outline:none !important}');
  });

  document.addEventListener('keydown', () => {
    setCss(`*:focus { outline: 2px solid ${colors.primary}; outline-offset: 2px; }`);
  });
}
