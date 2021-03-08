import get from 'lodash.get';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import branch from 'recompose/branch';
import compose from 'recompose/compose';
import renderComponent from 'recompose/renderComponent';
import withProps from 'recompose/withProps';

import FILE_TYPES from '../../../constants/file-types';
import STEP_CATEGORIES from '../../../constants/step-categories';
import BackButton from '../../components/BackButton';
import FileName from '../../components/FileName';
import FilesList from '../../components/Forms/FilesList';
import LinkIcon from '../../components/Icons/Link';
import Image from '../../components/Image';
import MarkdownContent from '../../components/MarkdownContent';
import StepHeader from '../../components/StepHeader';
import StepTag from '../../components/StepTag';
import { fetchStepTemplateAction } from '../../store/admin/steptemplates';
import shouldBeLoggedIn from '../../utils/should-be-logged-in';
import NotFoundPage from '../NotFoundPage';
import styles from './TemplatePreviewPage.module.scss';

const TemplatePreviewPage = ({ steptemplate, isResource, imageAttachments, otherAttachments, userId, superuser }) => (
  <>
    <StepHeader className={isResource ? styles.headerResource : styles.header}>
      <div className={styles.strech}>
        <BackButton href="/templates" />
        <StepTag side="left" tag={steptemplate.category} />
      </div>
      <div className={styles.media}>
        <div className={styles.titleWrap}>
          <h1>{steptemplate.title}</h1>
        </div>
      </div>
    </StepHeader>
    <div className={styles.content}>
      <div className={styles.section}>
        <MarkdownContent className={styles.description}>{steptemplate.description}</MarkdownContent>
        {steptemplate.urls &&
          steptemplate.urls
            .filter((link) => link)
            .map((link, index) => (
              <a href={link} target="_blank" rel="noopener noreferrer" key={index}>
                <FileName icon={LinkIcon} name={link} className={styles.file} />
              </a>
            ))}
        {steptemplate.videoLinks &&
          steptemplate.videoLinks
            .filter((url) => url)
            .map((url, index) => (
              <div className={styles.video} key={index}>
                <ReactPlayer url={url} />
              </div>
            ))}
        {imageAttachments &&
          imageAttachments.map((att, index) => (
            <div className={styles.image} key={index}>
              <Image src={att.url} alt={`${att.name} image attachment`} />
            </div>
          ))}
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Files</h2>
        <FilesList files={otherAttachments} deletable={false} downloadable accessorId={userId} superuser={superuser} />
      </div>
    </div>
    {isResource && <StepHeader className={styles.headerBottom} />}
  </>
);

TemplatePreviewPage.propTypes = {
  steptemplate: PropTypes.object.isRequired,
  isResource: PropTypes.bool,
  imageAttachments: PropTypes.array,
  otherAttachments: PropTypes.array,
  userId: PropTypes.number,
  superuser: PropTypes.bool,
};

const TemplatePreviewPageEnhanced = compose(
  withRouter,
  withProps((ownProps) => ({
    ...ownProps,
    templateId: get(ownProps, 'router.query.id'),
  })),
  connect(({ admin: { steptemplates }, auth }, { templateId }) => {
    const steptemplate = steptemplates.byId[templateId];
    const imageAttachments = steptemplate.attachments.filter((att) => {
      const fileType = att.extension && FILE_TYPES[att.extension.toLowerCase()];
      return fileType === 'image';
    });
    const otherAttachments = steptemplate.attachments.filter((att) => {
      const fileType = att.extension && FILE_TYPES[att.extension.toLowerCase()];
      return fileType !== 'image';
    });
    const isResource = get(steptemplate, 'category', null) === STEP_CATEGORIES.CATEGORIES.RESOURCE;
    return {
      steptemplate,
      isResource,
      imageAttachments,
      otherAttachments,
      userId: get(auth.me, 'id', null),
      superuser: get(auth.me, 'superuser', false),
    };
  }),
  branch(({ steptemplate }) => !steptemplate, renderComponent(NotFoundPage)),
)(TemplatePreviewPage);

TemplatePreviewPageEnhanced.getInitialProps = async ({ store, query }) => {
  const { id } = query;

  await new Promise((resolve) => {
    store.dispatch(
      fetchStepTemplateAction(id, {
        resolve,
        reject: resolve,
      }),
    );
  });
  return {};
};

export default shouldBeLoggedIn(TemplatePreviewPageEnhanced);
