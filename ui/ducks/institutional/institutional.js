import { createSelector } from 'reselect';
import { createSlice } from '@reduxjs/toolkit';
import { captureException } from '@sentry/browser';
import { mmiActionsFactory } from '../../store/institutional/institution-background';

const createComplianceActionType = (action) =>
  `metamask/institutional-features/compliance/${action}`;

const SET_HISTORICAL_REPORTS = createComplianceActionType(
  'SET_HISTORICAL_REPORTS',
);

const name = 'institutionalFeatures';

const initialState = {
  historicalReports: {},
  complianceProjectId: '',
  complianceClientId: '',
  reportsInProgress: {},
};

const slice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setHistoricalReports(state, action) {
      state.historicalReports[action.payload.address] = [
        ...action.payload.reports,
      ];
    },
  },
});

const { actions, reducer } = slice;

export default reducer;

export const getComplianceProjectId = (state) =>
  state.metamask[name].complianceProjectId;
export const getComplianceClientId = (state) =>
  state.metamask[name].complianceClientId;
export const getComplianceTenantSubdomain = (state) =>
  state.metamask[name].complianceTenantSubdomain;
export const getComplianceHistoricalReports = (state) =>
  state.metamask[name].historicalReports;
export const getComplianceReportsInProgress = (state) =>
  state.metamask[name].reportsInProgress;
export const getInstitutionalConnectRequests = (state) =>
  state.metamask[name].connectRequests;
export const complianceActivated = (state) =>
  Boolean(state.metamask[name].complianceProjectId);

export const getComplianceHistoricalReportsByAddress = (address) =>
  createSelector(getComplianceHistoricalReports, (reports) =>
    reports ? reports[address] : [undefined],
  );

export const getComplianceReportsInProgressByAddress = (address) =>
  createSelector(getComplianceReportsInProgress, (reports) =>
    reports ? reports[address.toLowerCase()] : undefined,
  );

export const fetchHistoricalReports = (address, testProjectId = undefined) => {
  return async (dispatch, getState) => {
    const state = getState();
    const mmiActions = mmiActionsFactory();

    let projectId;

    // testProjectId is provided to make a test request, which checks if projectId is correct
    if (!testProjectId) {
      projectId = getComplianceProjectId(state);
      if (!projectId) {
        return;
      }
    }

    try {
      const result = await dispatch(
        mmiActions.getComplianceHistoricalReportsByAddress(address, projectId),
      );

      dispatch(
        mmiActions.syncReportsInProgress({
          address,
          historicalReports: result.items ? result.items : [],
        }),
      );
      dispatch({
        type: SET_HISTORICAL_REPORTS,
        payload: {
          address,
          reports: result.items
            ? result.items.filter((report) => report.status !== 'inProgress')
            : [],
        },
      });
    } catch (error) {
      console.error(error);
      captureException(error);
    }
  };
};

export function generateComplianceReport(address) {
  return async (dispatch, _getState) => {
    const mmiActions = mmiActionsFactory();
    dispatch(mmiActions.generateComplianceReport(address));
  };
}

const { setHistoricalReports } = actions;

export { setHistoricalReports };
