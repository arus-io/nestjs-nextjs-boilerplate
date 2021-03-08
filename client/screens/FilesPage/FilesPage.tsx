import cx from 'classnames';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';

import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
import PlusInCircle from '../../components/Icons/PlusInCircle';
import UploadFileModal from '../../components/UploadFileModal/UploadFileModal';
import { fetchCompanyAction } from '../../store/admin/companies';
import { deleteFileAction, getFilesAction, toggleUploadFileModalAction } from '../../store/files/actions';
import shouldBeLoggedIn from '../../utils/should-be-logged-in';
import styles from './FilesPage.module.scss';
import FilesPlanList from './FilesPlanList';

const FilesPage = (props) => {
  const { ownPlans, othersPlans, toggleUploadFileModal, planId, employee, companyId } = props;

  const title = employee ? `Files for ${employee.firstName} ${employee.lastName}` : 'Files';

  const renderFileList = () => {
    if (employee) {
      return <FilesPlanList key={3} title={''} plans={othersPlans} {...props} />;
    } else {
      const shouldShowMyFiles = ownPlans.length || (!othersPlans.length && !ownPlans.length); // show something if all empty
      const shouldShowOtherFiles = othersPlans.length;
      return (
        <>
          {shouldShowMyFiles ? <FilesPlanList key={1} title={'My Plans:'} plans={ownPlans} {...props} /> : null}
          {shouldShowOtherFiles ? (
            <FilesPlanList key={2} title={'Plans I’m Managing:'} plans={othersPlans} {...props} />
          ) : null}
        </>
      );
    }
  };

  return (
    <>
      {employee ? <BackButton href={`/companies/company?companyId=${companyId}`} /> : null}
      <div className={styles.header}>
        <h2>{title}</h2>
        <Button
          icon={PlusInCircle}
          className={cx(styles.header, styles.action)}
          onClick={() => toggleUploadFileModal(true)}
          color="primary"
        >
          Upload File
        </Button>
      </div>
      {renderFileList()}
      <UploadFileModal preselectedPlanId={planId} employeeId={employee?.id} companyId={companyId} />
    </>
  );
};

FilesPage.propTypes = {
  ownPlans: PropTypes.arrayOf(PropTypes.object),
  othersPlans: PropTypes.arrayOf(PropTypes.object),
  deleteFile: PropTypes.func.isRequired,
  toggleUploadFileModal: PropTypes.func.isRequired,
  meId: PropTypes.number,
  planId: PropTypes.string,
  companyId: PropTypes.string,
  employee: PropTypes.object,
  isSuperuser: PropTypes.bool,
};

const FilesPageEnhanced = compose(
  withProps((ownProps) => ({
    ...ownProps,
    planId: ownProps?.router?.query?.planId,
    companyId: ownProps?.router?.query?.companyId,
  })),
  connect(
    (
      { files, plans, auth: { me }, admin: { users } },
      {
        router: {
          query: { employeeId },
        },
      },
    ) => {
      const filesArray = Object.keys(files.byId).map((indexFile) => files.byId[indexFile]);
      const planMap: any = {};
      filesArray.forEach((file) => {
        const planId = file?.plan?.id || 0; // I think this will always be set anyways
        if (!planMap[planId]) {
          planMap[planId] = { ...file.plan };
          planMap[planId].files = [];
        }
        planMap[planId].files.push(file);
      });
      const plansWithFiles: any = Object.values(planMap);
      return {
        ownPlans: plansWithFiles.filter((plan) => plan.employeeId === me.id),
        othersPlans: plansWithFiles.filter((plan) => plan.employeeId !== me.id),
        deleting: files.deleteLoading,
        error: files.error,
        meId: get(me, 'id', null),
        employee: employeeId ? users.byId[employeeId] : null,
        isSuperuser: me.superuser,
      };
    },
    {
      deleteFile: deleteFileAction,
      toggleUploadFileModal: toggleUploadFileModalAction,
    },
  ),
)(FilesPage);

FilesPageEnhanced.getInitialProps = async ({ store, query: { planId, companyId } }) => {
  await new Promise((resolve) => {
    store.dispatch(
      getFilesAction({
        resolve,
        reject: resolve,
        planId,
      }),
    );
  });

  if (companyId) {
    await new Promise((resolve) => {
      store.dispatch(
        fetchCompanyAction(companyId, {
          resolve,
          reject: resolve,
        }),
      );
    });
  }
  return {};
};

export default shouldBeLoggedIn(FilesPageEnhanced);
