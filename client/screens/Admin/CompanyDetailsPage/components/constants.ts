import { IUserVM } from '../../../Hr/types';

export const employeesFiltersData: { [key: string]: IFilterProps<IUserVM> } = {
  query: {
    apply: (e, value) => {
      const lowerCaseValue = value.toLowerCase();

      return (
        e.firstName.toLowerCase().includes(lowerCaseValue) ||
        e.lastName.toLowerCase().includes(lowerCaseValue) ||
        e.email.toLowerCase().includes(lowerCaseValue)
      );
    },
    value: '',
  },
  checkbox: {
    apply: (e, value) => !e.archived || !!value,
    placeholder: 'View Archived',
    value: false,
  },
};
