import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import styles from './Pagination.module.scss';

const PAGES_INDEXES = 3;

const Pagination = ({ itemsPerPage, items, paginate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = Math.ceil(items.length / itemsPerPage);
  const [currentPages, setCurrentPages] = useState<number[]>([]);

  useEffect(() => {
    const _currentPages: number[] = [];

    const toLeft = Math.floor((PAGES_INDEXES - 1) / 2); // -1 is the middle
    const toRight = Math.ceil((PAGES_INDEXES - 1) / 2);
    let start = Math.max(currentPage - toLeft, 1);
    let end = Math.min(currentPage + toRight, pages);
    const remaining = PAGES_INDEXES - (end - start + 1);
    if (remaining) {
      if (start > 1) {
        start = Math.max(start - remaining, 1);
      } else {
        end = Math.min(end + toRight, pages);
      }
    }

    for (let index = start; index <= end; index++) {
      _currentPages.push(index);
    }
    setCurrentPages(_currentPages);
    if (_currentPages.length && !_currentPages.includes(currentPage)) {
      selectPage(_currentPages[_currentPages.length - 1]);
    }
  }, [currentPage, pages]);

  const selectPage = (number) => {
    setCurrentPage(number);
    paginate(number, itemsPerPage);
  };

  const prevPage = () => {
    const prevIndexPage = currentPage - 1;
    selectPage(prevIndexPage);
  };

  const nextPage = () => {
    const nextIndexPage = currentPage + 1;
    selectPage(nextIndexPage);
  };

  const hasMoreLeft = currentPage > 1;
  const hasMoreRight = currentPage < pages;
  return (
    <div className={styles.paginationTable}>
      <span className={styles.description}>{`${items.length} results`}</span>
      <nav>
        <ul className={styles.pagination}>
          {hasMoreLeft ? (
            <li className={styles.pageItem}>
              <a className={styles.pageLink} aria-label="Previous" onClick={() => prevPage()}>
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
          ) : null}
          {currentPages?.map((number, i) => (
            <li className={styles.pageItem} key={i}>
              <a
                className={cx(styles.pageLink, { [styles.active]: number === currentPage })}
                onClick={() => selectPage(number)}
              >
                {number}
              </a>
            </li>
          ))}
          {hasMoreRight ? (
            <li className={styles.pageItem}>
              <a className={styles.pageLink} aria-label="Next" onClick={() => nextPage()}>
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          ) : null}
        </ul>
      </nav>
    </div>
  );
};

Pagination.propTypes = {
  itemsPerPage: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.object),
  paginate: PropTypes.func,
};

export default Pagination;
