import cx from 'classnames';
import React, { useEffect, useState } from 'react';

import colors from '../../constants/colors';
import DownloadCSVLink from '../DowloadCSVLink/DowloadCSVLink';
import IconButton from '../IconButton';
import ChevronDown from '../Icons/ChevronDown';
import DownloadIcon from '../Icons/Download';
import Pagination from '../Pagination/Pagination';
import styles from './TableSortable.module.scss';

const getVal = (a) => {
  if (a === null) return '';
  switch (typeof a) {
    case 'string':
      return a.toLowerCase();
    default:
      return a;
  }
};

function resolveProp(obj: any, path: string) {
  const properties = path.split('.');
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

const SORT_DIR = { ascending: 1, descending: -1 };

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    if (!sortConfig) return items;
    const sortableItems = [...items];
    sortableItems.sort((a, b) => {
      if (sortConfig.sort instanceof Function) {
        return sortConfig.sort(a, b) * sortConfig.direction;
      }
      // default sort
      const valA = getVal(resolveProp(a, sortConfig.key));
      const valB = getVal(resolveProp(b, sortConfig.key));
      if (valA < valB) {
        return sortConfig.direction === SORT_DIR.ascending ? -1 : 1;
      }
      if (valA > valB) {
        return sortConfig.direction === SORT_DIR.ascending ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key, sort = null) => {
    let direction = SORT_DIR.descending;
    if (sortConfig?.key === key && sortConfig?.direction === SORT_DIR.descending) {
      // toggle
      direction = SORT_DIR.ascending;
    }
    setSortConfig({ key, direction, sort });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

export interface DownloadProps {
  data: any[];
  columns: string[];
  filename: string;
}

interface TableSortableProps {
  data: any[];
  columns: TableColumn[];
  className?: string;
  pagination?: any;
  initialSort?: any;
  children?: (item) => any;
  onRowClick?: (item) => any;
  rowActions?: (item) => any;
  exportData?: (() => Promise<DownloadProps>) | boolean;
  headerContent?: React.ReactNode;
}
interface TableColumn {
  key: string;
  label?: string;
  sort?: ((a: any, b: any) => number) | boolean;
  render?: (data) => any;
  renderCSV?: (data) => any;
  className?: string;
}
const TableSortable = (props: TableSortableProps) => {
  const { data, columns, className, initialSort, children, pagination, onRowClick, rowActions, headerContent } = props;
  const exportData = props.exportData ?? false;

  const [currentItems, setCurrentItems] = useState<any[]>([]);
  const [paginationData, setPaginationData] = useState<{ page: number; itemsPerPage: number }>({
    page: 1,
    itemsPerPage: pagination?.itemsPerPage || 10000,
  });

  const { items: sortedItems, requestSort, sortConfig } = useSortableData(data, initialSort);

  useEffect(() => {
    if (!currentItems || !paginationData) return;
    const { page, itemsPerPage } = paginationData;
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(sortedItems.slice(indexOfFirstItem, indexOfLastItem));
  }, [sortedItems, paginationData]);

  const getColumnClassNames = (column: TableColumn) => {
    let className = column.className;

    if (column.sort) {
      className += ` ${styles.sortable}`;
    }

    if (sortConfig && sortConfig.key === column.key) {
      return className + ` ${sortConfig.direction === SORT_DIR.descending ? styles.descending : styles.ascending}`;
    }
    return className;
  };

  const renderColumns = (props: TableSortableProps) => {
    const allCols = [...columns];
    if (props.onRowClick) {
      allCols.push({ key: 'rowClick', label: '' });
    }
    if (props.rowActions) {
      allCols.push({ key: 'acts', label: '' });
    }

    return allCols.map((column) => {
      return (
        <th
          key={column.key}
          className={getColumnClassNames(column)}
          onClick={column.sort ? () => requestSort(column.key, column.sort) : undefined}
        >
          <span>{(column.label ?? column.key).toUpperCase()}</span>
        </th>
      );
    });
  };

  const paginate = (page: number, itemsPerPage: number) => {
    setPaginationData({ page, itemsPerPage });
  };

  const handleDownloadCSV = async () => {
    let data;
    let columns;
    let filename = `export-${new Date().toLocaleDateString()}.csv`;
    if (exportData === false) return;
    if (exportData === true) {
      data = getCSVDataFromProps();
      columns = props.columns;
    } else {
      const d = await (exportData as any)();
      data = d.data;
      columns = d.columns;
      filename = d.filename || filename;
    }
    return { data, columns, filename };
  };

  const getCSVDataFromProps = () => {
    return props.data.map((row) => {
      const data = props.columns.reduce((acc, col) => {
        if (col.renderCSV) {
          acc[col.key] = col.renderCSV(row);
        } else if (col.render) {
          acc[col.key] = col.render(row);
        } else {
          acc[col.key] = resolveProp(row, col.key);
        }
        return acc;
      }, {});
      return data;
    });
  };

  return (
    <>
      {exportData || headerContent ? (
        <div className={styles.headerTable}>
          {headerContent ? headerContent : null}
          {exportData ? (
            <DownloadCSVLink
              exportFile={handleDownloadCSV as any}
              label={<IconButton icon={DownloadIcon} disabled={!data && data.length === 0} />}
            />
          ) : null}
        </div>
      ) : null}
      <div className={styles.tableWrapper}>
        <table className={cx(styles.table, className)}>
          <thead>
            <tr>{columns && renderColumns(props)}</tr>
          </thead>
          <tbody>
            {currentItems?.map((row, ix) => {
              if (children) return children(row); // custom renderer
              const onClick = onRowClick ? () => onRowClick(row) : undefined;
              return (
                <tr className={onRowClick ? styles.clickable : ''} key={ix} onClick={onClick}>
                  {columns.map((col) => (
                    <td key={col.key} className={styles.email}>
                      <span className={styles.mobileOnlyTitle}>{(col.label ?? col.key).toUpperCase()}: </span>
                      {col.render ? col.render(row) : resolveProp(row, col.key)}
                    </td>
                  ))}
                  {rowActions ? <td className={styles.rowActions}>{rowActions(row)}</td> : null}
                  {onRowClick ? (
                    <td className={styles.rowAction}>
                      <IconButton
                        className={cx(styles.rotate)}
                        icon={ChevronDown}
                        iconProps={{ fill: colors.lightGreen }}
                      />
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination && <Pagination itemsPerPage={pagination?.itemsPerPage} items={data} paginate={paginate} />}
    </>
  );
};

export default TableSortable;
