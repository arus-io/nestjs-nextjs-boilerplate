import cx from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import EmptyFilesList from '../../components/EmptyFilesList';
import FileName from '../../components/FileName';
import IconButton from '../../components/IconButton';
import DownloadIcon from '../../components/Icons/Download';
import FileIcon from '../../components/Icons/File';
import TrashIcon from '../../components/Icons/Trash';
import TableSortable from '../../components/TableSortable/TableSortable';
import { Link } from '../../router';
import styles from './FilesPage.module.scss';

const FilesPlanList = ({ title, plans, deleteFile, meId, isSuperuser }) => {
  return (
    <>
      <h2>{title} </h2>
      {plans.map((plan, idx) => {
        return (
          <React.Fragment key={idx}>
            <h3>{`${plan.title}`}</h3>
            {plan.files && plan.files.length ? (
              <TableSortable
                data={plan.files}
                rowActions={(file) => (
                  <>
                    {meId === file.uploaderId || isSuperuser ? (
                      <IconButton
                        key={1}
                        onClick={() => deleteFile({ id: file.id, stepId: file.step ? file.step.id : null })}
                        color="accentDark"
                        icon={TrashIcon}
                        className={styles.action}
                      />
                    ) : null}
                    <IconButton key={2} href={file.url} target="_blank" icon={DownloadIcon} className={styles.action} />
                  </>
                )}
                columns={[
                  {
                    key: 'title',
                    label: 'Document',
                    // eslint-disable-next-line react/display-name
                    render: (file) => <FileName icon={FileIcon} name={file.title} href={file.url} />,
                    className: `${styles.rowThird}`,
                  },
                  { key: 'createdAt', label: 'Uploaded', render: (file) => moment(file.createdAt).format('M/D/YY') },
                  {
                    key: 'uploader.firstName',
                    label: 'Author',
                    render: (file) => `${file.uploader.firstName} ${file.uploader.lastName}`,
                    className: `${styles.rowSixth}`,
                  },
                  {
                    key: 'step.title',
                    label: 'Step Uploaded On',
                    // eslint-disable-next-line react/display-name
                    render: (file) =>
                      file.step ? (
                        <Link href={`/step?stepId=${file.step.id}`}>
                          <a>{file.step.title}</a>
                        </Link>
                      ) : (
                        ''
                      ),
                    className: `${cx(styles.rowThird, styles.stepColumn)}`,
                  },
                ]}
              />
            ) : (
              <EmptyFilesList />
            )}
          </React.Fragment>
        );
      })}
      {!plans.length ? <EmptyFilesList /> : null}
    </>
  );
};

FilesPlanList.propTypes = {
  title: PropTypes.string,
  plans: PropTypes.arrayOf(PropTypes.object),
  deleteFile: PropTypes.func.isRequired,
  meId: PropTypes.number,
  isSuperuser: PropTypes.bool,
};

export default FilesPlanList;
