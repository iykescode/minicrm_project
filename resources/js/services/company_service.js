import {http, httpFile} from './http_service';

export function createCompany(data) {
    return httpFile().post('/companies', data);
}

export function loadCompanies() {
    return http().get('/companies');
}

export function deleteCompany(id) {
    return http().delete(`/companies/${id}`);
}
