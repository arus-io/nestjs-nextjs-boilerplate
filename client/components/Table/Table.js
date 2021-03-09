import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './Table.module.scss';

const Table = ({ headers, children, className }) => (
  <table className={cx(styles.table, className)}>
    <thead>
      <tr>
        {headers &&
          headers.map((header, index) => (
            <th
              key={index} // eslint-disable-line react/no-array-index-key
            >
              {header}
            </th>
          ))}
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);

Table.propTypes = {
  children: PropTypes.node,
  headers: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default Table;
