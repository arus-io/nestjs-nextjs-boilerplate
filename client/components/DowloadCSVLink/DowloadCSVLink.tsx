import get from 'lodash.get';
import React from 'react';

interface DownloadLinkProps {
  // filename: string;
  label: any;
  style: any;
  exportFile: (
    fileType: string,
  ) => Promise<{ columns: { label: string; key: string }[]; data: string[]; filename: string; format?: string }>;
  className?: string;
}

const DownloadLink = (p: DownloadLinkProps) => {
  const handleDownloadClick = (event) => {
    event.persist();
    event.preventDefault();
    function doDownload(text, fileName) {
      const blob = new Blob([text], {
        type: 'text/csv;charset=utf8;', // const type = isSafari() ? 'application/csv' : 'text/csv';
      });

      // create hidden link
      const href = window.URL.createObjectURL(blob);
      const element = document.createElement('a');
      document.body.appendChild(element);
      element.setAttribute('href', href);
      element.setAttribute('download', fileName);
      element.style.display = '';

      element.click();

      document.body.removeChild(element);
      window.URL.revokeObjectURL(href);
      event.stopPropagation();
    }

    const fileType = event.target.innerText;
    p.exportFile(fileType).then(({ data, filename, columns }) => {
      const separator = ',';
      const enclosingCharacter = '"';
      const _data = data.map((d) => {
        return columns
          .map((col) => {
            let val = get(d, col.key);
            if (val === undefined || val === null) val = '';
            return `${enclosingCharacter}${val}${enclosingCharacter}`;
          })
          .join(separator);
      });
      _data.unshift(
        columns.map((col) => `${enclosingCharacter}${col.label || col.key}${enclosingCharacter}`).join(separator),
      );
      doDownload(_data.join('\n'), filename);
    });
  };

  return (
    <a style={p.style} className={p.className} href={'#'} onClick={handleDownloadClick}>
      {p.label}
    </a>
  );
};

DownloadLink.defaultProps = {
  // filename: 'file.txt',
  label: 'Save',
  style: {
    margin: '5px 5px 0px 0px',
    textDecoration: 'underline',
    color: 'blue',
    cursor: 'pointer',
  },
  exportFile: () => {},
};

export default DownloadLink;
