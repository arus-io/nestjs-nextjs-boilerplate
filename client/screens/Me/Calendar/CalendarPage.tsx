import React from 'react';

import { useMyCalendarQuery } from '../../../_gen/graphql';
import PlanCalendar from '../../../components/PlanCalendar/PlanCalendar';
import { PageTitle } from '../../../layouts/Pages';
import shouldBeLoggedIn from '../../../utils/should-be-logged-in';
import { IPlanVM } from '../../Hr/types';
// import styles from './styles.module.scss';

interface IProps {
  plan: IPlanVM;
}

const defaultDate = new Date();
const CalendarPage = ({ plan }: IProps) => {
  const { data, error, loading } = useMyCalendarQuery();
  // const { schedule } = plan;
  if (!data) {
    return null;
  }

  return (
    <>
      <PageTitle title="Leave Calendar" />
      <PlanCalendar
        viewOnly
        leaveDays={data.me.schedule.days as any}
        defaultDate={defaultDate}
        // maxDate={plan.returnDate}
      />
    </>
  );
};

export default shouldBeLoggedIn(CalendarPage);
