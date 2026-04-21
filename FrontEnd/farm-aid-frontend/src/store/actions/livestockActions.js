import { createAction } from '@reduxjs/toolkit';

// Action types
export const FETCH_LIVESTOCK_REQUEST = 'livestock/FETCH_LIVESTOCK_REQUEST';
export const FETCH_LIVESTOCK_SUCCESS = 'livestock/FETCH_LIVESTOCK_SUCCESS';
export const FETCH_LIVESTOCK_FAILURE = 'livestock/FETCH_LIVESTOCK_FAILURE';

export const FETCH_LIVESTOCK_BY_ID_REQUEST = 'livestock/FETCH_LIVESTOCK_BY_ID_REQUEST';
export const FETCH_LIVESTOCK_BY_ID_SUCCESS = 'livestock/FETCH_LIVESTOCK_BY_ID_SUCCESS';
export const FETCH_LIVESTOCK_BY_ID_FAILURE = 'livestock/FETCH_LIVESTOCK_BY_ID_FAILURE';

export const ADD_LIVESTOCK_REQUEST = 'livestock/ADD_LIVESTOCK_REQUEST';
export const ADD_LIVESTOCK_SUCCESS = 'livestock/ADD_LIVESTOCK_SUCCESS';
export const ADD_LIVESTOCK_FAILURE = 'livestock/ADD_LIVESTOCK_FAILURE';

export const UPDATE_LIVESTOCK_REQUEST = 'livestock/UPDATE_LIVESTOCK_REQUEST';
export const UPDATE_LIVESTOCK_SUCCESS = 'livestock/UPDATE_LIVESTOCK_SUCCESS';
export const UPDATE_LIVESTOCK_FAILURE = 'livestock/UPDATE_LIVESTOCK_FAILURE';

export const DELETE_LIVESTOCK_REQUEST = 'livestock/DELETE_LIVESTOCK_REQUEST';
export const DELETE_LIVESTOCK_SUCCESS = 'livestock/DELETE_LIVESTOCK_SUCCESS';
export const DELETE_LIVESTOCK_FAILURE = 'livestock/DELETE_LIVESTOCK_FAILURE';

export const FETCH_HEALTH_RECORDS_REQUEST = 'livestock/FETCH_HEALTH_RECORDS_REQUEST';
export const FETCH_HEALTH_RECORDS_SUCCESS = 'livestock/FETCH_HEALTH_RECORDS_SUCCESS';
export const FETCH_HEALTH_RECORDS_FAILURE = 'livestock/FETCH_HEALTH_RECORDS_FAILURE';

export const ADD_HEALTH_RECORD_REQUEST = 'livestock/ADD_HEALTH_RECORD_REQUEST';
export const ADD_HEALTH_RECORD_SUCCESS = 'livestock/ADD_HEALTH_RECORD_SUCCESS';
export const ADD_HEALTH_RECORD_FAILURE = 'livestock/ADD_HEALTH_RECORD_FAILURE';

export const UPDATE_HEALTH_RECORD_REQUEST = 'livestock/UPDATE_HEALTH_RECORD_REQUEST';
export const UPDATE_HEALTH_RECORD_SUCCESS = 'livestock/UPDATE_HEALTH_RECORD_SUCCESS';
export const UPDATE_HEALTH_RECORD_FAILURE = 'livestock/UPDATE_HEALTH_RECORD_FAILURE';

export const DELETE_HEALTH_RECORD_REQUEST = 'livestock/DELETE_HEALTH_RECORD_REQUEST';
export const DELETE_HEALTH_RECORD_SUCCESS = 'livestock/DELETE_HEALTH_RECORD_SUCCESS';
export const DELETE_HEALTH_RECORD_FAILURE = 'livestock/DELETE_HEALTH_RECORD_FAILURE';

export const FETCH_VACCINATION_SCHEDULE_REQUEST = 'livestock/FETCH_VACCINATION_SCHEDULE_REQUEST';
export const FETCH_VACCINATION_SCHEDULE_SUCCESS = 'livestock/FETCH_VACCINATION_SCHEDULE_SUCCESS';
export const FETCH_VACCINATION_SCHEDULE_FAILURE = 'livestock/FETCH_VACCINATION_SCHEDULE_FAILURE';

export const RECORD_VACCINATION_REQUEST = 'livestock/RECORD_VACCINATION_REQUEST';
export const RECORD_VACCINATION_SUCCESS = 'livestock/RECORD_VACCINATION_SUCCESS';
export const RECORD_VACCINATION_FAILURE = 'livestock/RECORD_VACCINATION_FAILURE';

export const FETCH_LIVESTOCK_STATS_REQUEST = 'livestock/FETCH_LIVESTOCK_STATS_REQUEST';
export const FETCH_LIVESTOCK_STATS_SUCCESS = 'livestock/FETCH_LIVESTOCK_STATS_SUCCESS';
export const FETCH_LIVESTOCK_STATS_FAILURE = 'livestock/FETCH_LIVESTOCK_STATS_FAILURE';

export const SEARCH_LIVESTOCK_REQUEST = 'livestock/SEARCH_LIVESTOCK_REQUEST';
export const SEARCH_LIVESTOCK_SUCCESS = 'livestock/SEARCH_LIVESTOCK_SUCCESS';
export const SEARCH_LIVESTOCK_FAILURE = 'livestock/SEARCH_LIVESTOCK_FAILURE';

export const SYNC_LIVESTOCK_REQUEST = 'livestock/SYNC_LIVESTOCK_REQUEST';
export const SYNC_LIVESTOCK_SUCCESS = 'livestock/SYNC_LIVESTOCK_SUCCESS';
export const SYNC_LIVESTOCK_FAILURE = 'livestock/SYNC_LIVESTOCK_FAILURE';

export const SET_SELECTED_ANIMAL = 'livestock/SET_SELECTED_ANIMAL';
export const CLEAR_SELECTED_ANIMAL = 'livestock/CLEAR_SELECTED_ANIMAL';
export const SET_LIVESTOCK_FILTERS = 'livestock/SET_LIVESTOCK_FILTERS';
export const CLEAR_LIVESTOCK_FILTERS = 'livestock/CLEAR_LIVESTOCK_FILTERS';
export const SET_LIVESTOCK_PAGINATION = 'livestock/SET_LIVESTOCK_PAGINATION';
export const CLEAR_LIVESTOCK_ERROR = 'livestock/CLEAR_LIVESTOCK_ERROR';

// Action creators
export const fetchLivestockRequest = createAction(FETCH_LIVESTOCK_REQUEST, (params = {}) => ({
  payload: params,
}));

export const fetchLivestockSuccess = createAction(FETCH_LIVESTOCK_SUCCESS, (livestock, total) => ({
  payload: { livestock, total },
}));

export const fetchLivestockFailure = createAction(FETCH_LIVESTOCK_FAILURE, (error) => ({
  payload: error,
}));

export const fetchLivestockByIdRequest = createAction(FETCH_LIVESTOCK_BY_ID_REQUEST, (id) => ({
  payload: id,
}));

export const fetchLivestockByIdSuccess = createAction(FETCH_LIVESTOCK_BY_ID_SUCCESS, (animal) => ({
  payload: animal,
}));

export const fetchLivestockByIdFailure = createAction(FETCH_LIVESTOCK_BY_ID_FAILURE, (error) => ({
  payload: error,
}));

export const addLivestockRequest = createAction(ADD_LIVESTOCK_REQUEST, (animalData) => ({
  payload: animalData,
}));

export const addLivestockSuccess = createAction(ADD_LIVESTOCK_SUCCESS, (animal) => ({
  payload: animal,
}));

export const addLivestockFailure = createAction(ADD_LIVESTOCK_FAILURE, (error) => ({
  payload: error,
}));

export const updateLivestockRequest = createAction(UPDATE_LIVESTOCK_REQUEST, (id, data) => ({
  payload: { id, data },
}));

export const updateLivestockSuccess = createAction(UPDATE_LIVESTOCK_SUCCESS, (animal) => ({
  payload: animal,
}));

export const updateLivestockFailure = createAction(UPDATE_LIVESTOCK_FAILURE, (error) => ({
  payload: error,
}));

export const deleteLivestockRequest = createAction(DELETE_LIVESTOCK_REQUEST, (id) => ({
  payload: id,
}));

export const deleteLivestockSuccess = createAction(DELETE_LIVESTOCK_SUCCESS, (id) => ({
  payload: id,
}));

export const deleteLivestockFailure = createAction(DELETE_LIVESTOCK_FAILURE, (error) => ({
  payload: error,
}));

export const fetchHealthRecordsRequest = createAction(FETCH_HEALTH_RECORDS_REQUEST, (livestockId) => ({
  payload: livestockId,
}));

export const fetchHealthRecordsSuccess = createAction(FETCH_HEALTH_RECORDS_SUCCESS, (livestockId, records) => ({
  payload: { livestockId, records },
}));

export const fetchHealthRecordsFailure = createAction(FETCH_HEALTH_RECORDS_FAILURE, (error) => ({
  payload: error,
}));

export const addHealthRecordRequest = createAction(ADD_HEALTH_RECORD_REQUEST, (livestockId, data) => ({
  payload: { livestockId, data },
}));

export const addHealthRecordSuccess = createAction(ADD_HEALTH_RECORD_SUCCESS, (livestockId, record) => ({
  payload: { livestockId, record },
}));

export const addHealthRecordFailure = createAction(ADD_HEALTH_RECORD_FAILURE, (error) => ({
  payload: error,
}));

export const updateHealthRecordRequest = createAction(UPDATE_HEALTH_RECORD_REQUEST, (id, data) => ({
  payload: { id, data },
}));

export const updateHealthRecordSuccess = createAction(UPDATE_HEALTH_RECORD_SUCCESS, (record) => ({
  payload: record,
}));

export const updateHealthRecordFailure = createAction(UPDATE_HEALTH_RECORD_FAILURE, (error) => ({
  payload: error,
}));

export const deleteHealthRecordRequest = createAction(DELETE_HEALTH_RECORD_REQUEST, (id) => ({
  payload: id,
}));

export const deleteHealthRecordSuccess = createAction(DELETE_HEALTH_RECORD_SUCCESS, (id) => ({
  payload: id,
}));

export const deleteHealthRecordFailure = createAction(DELETE_HEALTH_RECORD_FAILURE, (error) => ({
  payload: error,
}));

export const fetchVaccinationScheduleRequest = createAction(FETCH_VACCINATION_SCHEDULE_REQUEST);
export const fetchVaccinationScheduleSuccess = createAction(FETCH_VACCINATION_SCHEDULE_SUCCESS, (schedule) => ({
  payload: schedule,
}));
export const fetchVaccinationScheduleFailure = createAction(FETCH_VACCINATION_SCHEDULE_FAILURE, (error) => ({
  payload: error,
}));

export const recordVaccinationRequest = createAction(RECORD_VACCINATION_REQUEST, (livestockId, data) => ({
  payload: { livestockId, data },
}));
export const recordVaccinationSuccess = createAction(RECORD_VACCINATION_SUCCESS, (record) => ({
  payload: record,
}));
export const recordVaccinationFailure = createAction(RECORD_VACCINATION_FAILURE, (error) => ({
  payload: error,
}));

export const fetchLivestockStatsRequest = createAction(FETCH_LIVESTOCK_STATS_REQUEST);
export const fetchLivestockStatsSuccess = createAction(FETCH_LIVESTOCK_STATS_SUCCESS, (stats) => ({
  payload: stats,
}));
export const fetchLivestockStatsFailure = createAction(FETCH_LIVESTOCK_STATS_FAILURE, (error) => ({
  payload: error,
}));

export const searchLivestockRequest = createAction(SEARCH_LIVESTOCK_REQUEST, (query) => ({
  payload: query,
}));
export const searchLivestockSuccess = createAction(SEARCH_LIVESTOCK_SUCCESS, (results) => ({
  payload: results,
}));
export const searchLivestockFailure = createAction(SEARCH_LIVESTOCK_FAILURE, (error) => ({
  payload: error,
}));

export const syncLivestockRequest = createAction(SYNC_LIVESTOCK_REQUEST, (livestock) => ({
  payload: livestock,
}));
export const syncLivestockSuccess = createAction(SYNC_LIVESTOCK_SUCCESS, (result) => ({
  payload: result,
}));
export const syncLivestockFailure = createAction(SYNC_LIVESTOCK_FAILURE, (error) => ({
  payload: error,
}));

export const setSelectedAnimal = createAction(SET_SELECTED_ANIMAL, (animal) => ({
  payload: animal,
}));

export const clearSelectedAnimal = createAction(CLEAR_SELECTED_ANIMAL);

export const setLivestockFilters = createAction(SET_LIVESTOCK_FILTERS, (filters) => ({
  payload: filters,
}));

export const clearLivestockFilters = createAction(CLEAR_LIVESTOCK_FILTERS);

export const setLivestockPagination = createAction(SET_LIVESTOCK_PAGINATION, (pagination) => ({
  payload: pagination,
}));

export const clearLivestockError = createAction(CLEAR_LIVESTOCK_ERROR);

// Action object for easier imports
const livestockActions = {
  fetchLivestockRequest,
  fetchLivestockSuccess,
  fetchLivestockFailure,
  fetchLivestockByIdRequest,
  fetchLivestockByIdSuccess,
  fetchLivestockByIdFailure,
  addLivestockRequest,
  addLivestockSuccess,
  addLivestockFailure,
  updateLivestockRequest,
  updateLivestockSuccess,
  updateLivestockFailure,
  deleteLivestockRequest,
  deleteLivestockSuccess,
  deleteLivestockFailure,
  fetchHealthRecordsRequest,
  fetchHealthRecordsSuccess,
  fetchHealthRecordsFailure,
  addHealthRecordRequest,
  addHealthRecordSuccess,
  addHealthRecordFailure,
  updateHealthRecordRequest,
  updateHealthRecordSuccess,
  updateHealthRecordFailure,
  deleteHealthRecordRequest,
  deleteHealthRecordSuccess,
  deleteHealthRecordFailure,
  fetchVaccinationScheduleRequest,
  fetchVaccinationScheduleSuccess,
  fetchVaccinationScheduleFailure,
  recordVaccinationRequest,
  recordVaccinationSuccess,
  recordVaccinationFailure,
  fetchLivestockStatsRequest,
  fetchLivestockStatsSuccess,
  fetchLivestockStatsFailure,
  searchLivestockRequest,
  searchLivestockSuccess,
  searchLivestockFailure,
  syncLivestockRequest,
  syncLivestockSuccess,
  syncLivestockFailure,
  setSelectedAnimal,
  clearSelectedAnimal,
  setLivestockFilters,
  clearLivestockFilters,
  setLivestockPagination,
  clearLivestockError,
};

export default livestockActions;