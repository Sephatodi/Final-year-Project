import { createAction } from '@reduxjs/toolkit';

// Action types
export const FETCH_REPORTS_REQUEST = 'disease/FETCH_REPORTS_REQUEST';
export const FETCH_REPORTS_SUCCESS = 'disease/FETCH_REPORTS_SUCCESS';
export const FETCH_REPORTS_FAILURE = 'disease/FETCH_REPORTS_FAILURE';

export const FETCH_REPORT_BY_ID_REQUEST = 'disease/FETCH_REPORT_BY_ID_REQUEST';
export const FETCH_REPORT_BY_ID_SUCCESS = 'disease/FETCH_REPORT_BY_ID_SUCCESS';
export const FETCH_REPORT_BY_ID_FAILURE = 'disease/FETCH_REPORT_BY_ID_FAILURE';

export const SUBMIT_REPORT_REQUEST = 'disease/SUBMIT_REPORT_REQUEST';
export const SUBMIT_REPORT_SUCCESS = 'disease/SUBMIT_REPORT_SUCCESS';
export const SUBMIT_REPORT_FAILURE = 'disease/SUBMIT_REPORT_FAILURE';

export const UPDATE_REPORT_REQUEST = 'disease/UPDATE_REPORT_REQUEST';
export const UPDATE_REPORT_SUCCESS = 'disease/UPDATE_REPORT_SUCCESS';
export const UPDATE_REPORT_FAILURE = 'disease/UPDATE_REPORT_FAILURE';

export const UPDATE_REPORT_STATUS_REQUEST = 'disease/UPDATE_REPORT_STATUS_REQUEST';
export const UPDATE_REPORT_STATUS_SUCCESS = 'disease/UPDATE_REPORT_STATUS_SUCCESS';
export const UPDATE_REPORT_STATUS_FAILURE = 'disease/UPDATE_REPORT_STATUS_FAILURE';

export const CHECK_SYMPTOMS_REQUEST = 'disease/CHECK_SYMPTOMS_REQUEST';
export const CHECK_SYMPTOMS_SUCCESS = 'disease/CHECK_SYMPTOMS_SUCCESS';
export const CHECK_SYMPTOMS_FAILURE = 'disease/CHECK_SYMPTOMS_FAILURE';

export const FETCH_ZONES_REQUEST = 'disease/FETCH_ZONES_REQUEST';
export const FETCH_ZONES_SUCCESS = 'disease/FETCH_ZONES_SUCCESS';
export const FETCH_ZONES_FAILURE = 'disease/FETCH_ZONES_FAILURE';

export const FETCH_ZONE_BY_ID_REQUEST = 'disease/FETCH_ZONE_BY_ID_REQUEST';
export const FETCH_ZONE_BY_ID_SUCCESS = 'disease/FETCH_ZONE_BY_ID_SUCCESS';
export const FETCH_ZONE_BY_ID_FAILURE = 'disease/FETCH_ZONE_BY_ID_FAILURE';

export const FETCH_NEARBY_REPORTS_REQUEST = 'disease/FETCH_NEARBY_REPORTS_REQUEST';
export const FETCH_NEARBY_REPORTS_SUCCESS = 'disease/FETCH_NEARBY_REPORTS_SUCCESS';
export const FETCH_NEARBY_REPORTS_FAILURE = 'disease/FETCH_NEARBY_REPORTS_FAILURE';

export const FETCH_DISEASE_STATS_REQUEST = 'disease/FETCH_DISEASE_STATS_REQUEST';
export const FETCH_DISEASE_STATS_SUCCESS = 'disease/FETCH_DISEASE_STATS_SUCCESS';
export const FETCH_DISEASE_STATS_FAILURE = 'disease/FETCH_DISEASE_STATS_FAILURE';

export const UPLOAD_REPORT_PHOTOS_REQUEST = 'disease/UPLOAD_REPORT_PHOTOS_REQUEST';
export const UPLOAD_REPORT_PHOTOS_SUCCESS = 'disease/UPLOAD_REPORT_PHOTOS_SUCCESS';
export const UPLOAD_REPORT_PHOTOS_FAILURE = 'disease/UPLOAD_REPORT_PHOTOS_FAILURE';

export const SYNC_REPORTS_REQUEST = 'disease/SYNC_REPORTS_REQUEST';
export const SYNC_REPORTS_SUCCESS = 'disease/SYNC_REPORTS_SUCCESS';
export const SYNC_REPORTS_FAILURE = 'disease/SYNC_REPORTS_FAILURE';

export const ASSIGN_OFFICER_REQUEST = 'disease/ASSIGN_OFFICER_REQUEST';
export const ASSIGN_OFFICER_SUCCESS = 'disease/ASSIGN_OFFICER_SUCCESS';
export const ASSIGN_OFFICER_FAILURE = 'disease/ASSIGN_OFFICER_FAILURE';

export const SET_SELECTED_REPORT = 'disease/SET_SELECTED_REPORT';
export const CLEAR_SELECTED_REPORT = 'disease/CLEAR_SELECTED_REPORT';
export const CLEAR_SYMPTOM_RESULTS = 'disease/CLEAR_SYMPTOM_RESULTS';
export const SET_DISEASE_FILTERS = 'disease/SET_DISEASE_FILTERS';
export const CLEAR_DISEASE_FILTERS = 'disease/CLEAR_DISEASE_FILTERS';
export const CLEAR_DISEASE_ERROR = 'disease/CLEAR_DISEASE_ERROR';

// Action creators
export const fetchReportsRequest = createAction(FETCH_REPORTS_REQUEST, (params = {}) => ({
  payload: params,
}));

export const fetchReportsSuccess = createAction(FETCH_REPORTS_SUCCESS, (reports, stats) => ({
  payload: { reports, stats },
}));

export const fetchReportsFailure = createAction(FETCH_REPORTS_FAILURE, (error) => ({
  payload: error,
}));

export const fetchReportByIdRequest = createAction(FETCH_REPORT_BY_ID_REQUEST, (id) => ({
  payload: id,
}));

export const fetchReportByIdSuccess = createAction(FETCH_REPORT_BY_ID_SUCCESS, (report) => ({
  payload: report,
}));

export const fetchReportByIdFailure = createAction(FETCH_REPORT_BY_ID_FAILURE, (error) => ({
  payload: error,
}));

export const submitReportRequest = createAction(SUBMIT_REPORT_REQUEST, (reportData) => ({
  payload: reportData,
}));

export const submitReportSuccess = createAction(SUBMIT_REPORT_SUCCESS, (report) => ({
  payload: report,
}));

export const submitReportFailure = createAction(SUBMIT_REPORT_FAILURE, (error) => ({
  payload: error,
}));

export const updateReportRequest = createAction(UPDATE_REPORT_REQUEST, (id, data) => ({
  payload: { id, data },
}));

export const updateReportSuccess = createAction(UPDATE_REPORT_SUCCESS, (report) => ({
  payload: report,
}));

export const updateReportFailure = createAction(UPDATE_REPORT_FAILURE, (error) => ({
  payload: error,
}));

export const updateReportStatusRequest = createAction(UPDATE_REPORT_STATUS_REQUEST, (id, status, response) => ({
  payload: { id, status, response },
}));

export const updateReportStatusSuccess = createAction(UPDATE_REPORT_STATUS_SUCCESS, (id, status, response) => ({
  payload: { id, status, response },
}));

export const updateReportStatusFailure = createAction(UPDATE_REPORT_STATUS_FAILURE, (error) => ({
  payload: error,
}));

export const checkSymptomsRequest = createAction(CHECK_SYMPTOMS_REQUEST, (species, symptoms, photos) => ({
  payload: { species, symptoms, photos },
}));

export const checkSymptomsSuccess = createAction(CHECK_SYMPTOMS_SUCCESS, (results) => ({
  payload: results,
}));

export const checkSymptomsFailure = createAction(CHECK_SYMPTOMS_FAILURE, (error) => ({
  payload: error,
}));

export const fetchZonesRequest = createAction(FETCH_ZONES_REQUEST);
export const fetchZonesSuccess = createAction(FETCH_ZONES_SUCCESS, (zones) => ({
  payload: zones,
}));
export const fetchZonesFailure = createAction(FETCH_ZONES_FAILURE, (error) => ({
  payload: error,
}));

export const fetchZoneByIdRequest = createAction(FETCH_ZONE_BY_ID_REQUEST, (id) => ({
  payload: id,
}));
export const fetchZoneByIdSuccess = createAction(FETCH_ZONE_BY_ID_SUCCESS, (zone) => ({
  payload: zone,
}));
export const fetchZoneByIdFailure = createAction(FETCH_ZONE_BY_ID_FAILURE, (error) => ({
  payload: error,
}));

export const fetchNearbyReportsRequest = createAction(FETCH_NEARBY_REPORTS_REQUEST, (lat, lng, radius) => ({
  payload: { lat, lng, radius },
}));
export const fetchNearbyReportsSuccess = createAction(FETCH_NEARBY_REPORTS_SUCCESS, (reports) => ({
  payload: reports,
}));
export const fetchNearbyReportsFailure = createAction(FETCH_NEARBY_REPORTS_FAILURE, (error) => ({
  payload: error,
}));

export const fetchDiseaseStatsRequest = createAction(FETCH_DISEASE_STATS_REQUEST);
export const fetchDiseaseStatsSuccess = createAction(FETCH_DISEASE_STATS_SUCCESS, (stats) => ({
  payload: stats,
}));
export const fetchDiseaseStatsFailure = createAction(FETCH_DISEASE_STATS_FAILURE, (error) => ({
  payload: error,
}));

export const uploadReportPhotosRequest = createAction(UPLOAD_REPORT_PHOTOS_REQUEST, (reportId, photos) => ({
  payload: { reportId, photos },
}));
export const uploadReportPhotosSuccess = createAction(UPLOAD_REPORT_PHOTOS_SUCCESS, (reportId, photoUrls) => ({
  payload: { reportId, photoUrls },
}));
export const uploadReportPhotosFailure = createAction(UPLOAD_REPORT_PHOTOS_FAILURE, (error) => ({
  payload: error,
}));

export const syncReportsRequest = createAction(SYNC_REPORTS_REQUEST, (reports) => ({
  payload: reports,
}));
export const syncReportsSuccess = createAction(SYNC_REPORTS_SUCCESS, (result) => ({
  payload: result,
}));
export const syncReportsFailure = createAction(SYNC_REPORTS_FAILURE, (error) => ({
  payload: error,
}));

export const assignOfficerRequest = createAction(ASSIGN_OFFICER_REQUEST, (reportId, officerId) => ({
  payload: { reportId, officerId },
}));
export const assignOfficerSuccess = createAction(ASSIGN_OFFICER_SUCCESS, (reportId, officer) => ({
  payload: { reportId, officer },
}));
export const assignOfficerFailure = createAction(ASSIGN_OFFICER_FAILURE, (error) => ({
  payload: error,
}));

export const setSelectedReport = createAction(SET_SELECTED_REPORT, (report) => ({
  payload: report,
}));

export const clearSelectedReport = createAction(CLEAR_SELECTED_REPORT);

export const clearSymptomResults = createAction(CLEAR_SYMPTOM_RESULTS);

export const setDiseaseFilters = createAction(SET_DISEASE_FILTERS, (filters) => ({
  payload: filters,
}));

export const clearDiseaseFilters = createAction(CLEAR_DISEASE_FILTERS);

export const clearDiseaseError = createAction(CLEAR_DISEASE_ERROR);

// Action object for easier imports
const diseaseActions = {
  fetchReportsRequest,
  fetchReportsSuccess,
  fetchReportsFailure,
  fetchReportByIdRequest,
  fetchReportByIdSuccess,
  fetchReportByIdFailure,
  submitReportRequest,
  submitReportSuccess,
  submitReportFailure,
  updateReportRequest,
  updateReportSuccess,
  updateReportFailure,
  updateReportStatusRequest,
  updateReportStatusSuccess,
  updateReportStatusFailure,
  checkSymptomsRequest,
  checkSymptomsSuccess,
  checkSymptomsFailure,
  fetchZonesRequest,
  fetchZonesSuccess,
  fetchZonesFailure,
  fetchZoneByIdRequest,
  fetchZoneByIdSuccess,
  fetchZoneByIdFailure,
  fetchNearbyReportsRequest,
  fetchNearbyReportsSuccess,
  fetchNearbyReportsFailure,
  fetchDiseaseStatsRequest,
  fetchDiseaseStatsSuccess,
  fetchDiseaseStatsFailure,
  uploadReportPhotosRequest,
  uploadReportPhotosSuccess,
  uploadReportPhotosFailure,
  syncReportsRequest,
  syncReportsSuccess,
  syncReportsFailure,
  assignOfficerRequest,
  assignOfficerSuccess,
  assignOfficerFailure,
  setSelectedReport,
  clearSelectedReport,
  clearSymptomResults,
  setDiseaseFilters,
  clearDiseaseFilters,
  clearDiseaseError,
};

export default diseaseActions;