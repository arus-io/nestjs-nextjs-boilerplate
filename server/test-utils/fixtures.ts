

export function getPolicyDraftData(companyId = 1) {
  return {
    employeeCount: 12,
    workingStates: ['AR', 'CO'],
    parentalIsStateFirst: 'YES',
    parentalDueDateDays: '23',
    companyId,
    // pastPayStubs: [], // @TODO
  };
}

export function getPolicyData(companyId = 1) {
  return {
    // @TODO - add a ton more of fields to test
    ...getPolicyDraftData(companyId),
    fmlaReasonsStated: 'YES',
  };
}

export function getEmployeeLeaveData() {
  return {
    hasDirectReports: 'YES',
    isOnlyPaidJob: 'YES',
    isLeaveContinuous: LEAVE_CONTINUOUS.NO.value,
    intermittentLeavePlan: 'a plan',
    expectedLeaveDate: new Date().toISOString().slice(0, 10),
    expectedReturnDate: new Date().toISOString().slice(0, 10),
    expectedDueDate: new Date().toISOString().slice(0, 10),
    communicationPreLeave: COMMUNICATION_TYPE.EMAIL.value,
    communicationPreLeaveValue: 'test@test.com',
    communicationLeave: COMMUNICATION_TYPE.PHONE.value,
    communicationLeaveValue: '1234567',
  };
}

export function getHrLeaveData(employeeId, managerId, companyId = 1) {
  return {
    employeeId,
    managerId,
    companyId,
    leaveType: [LEAVE_TYPE.FMLA.value, LEAVE_TYPE.PARENTAL_BIRTH.value],
    leaveTypeOther: 'string',
    hireDate: new Date(),
    jobTitle: 'string',
    salary: 1000,
    salaryPeriod: SALARY_PERIOD.ANNUALLY.value,
    workingState: 'CA',
    contractTypes: [EMPLOYEE_TYPE.FULL_TIME.value],
    enrolledHealthBenefits: 'YES',
    enrolledSTDisability: 'NO',
    enrolledLTDisability: false,
    enrolledNYLeave: [NY_LEAVE.NO.value],

    hadFmlaRecently: YES_NO.NO.value,
    hadFmlaDescription: 'string',
    hasWorkedMore: YES_NO_NOTSURE.NO.value,
    workingDays: [DAY_OF_WEEK.MONDAY.value, DAY_OF_WEEK.THURSDAY.value],
    minutesPerWeek: 2400,

    expectedLeaveDate: new Date(),
    pastPayStubs: [], // @TODO
  };
}
