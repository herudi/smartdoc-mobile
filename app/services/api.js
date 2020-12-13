import Axios from 'axios';
import { getAccessToken } from './storage';
import { objectToFormData } from 'object-to-formdata';
import { BASE_URL } from './constant';
import { objectToFormDataMobile } from '../utils/ObjectToFormDataMobile';

export const BASE_API = BASE_URL+'api/v1/';

Axios.interceptors.request.use(
    async config => {
        let token = '';
        if (global.glob_access_token) {
            token = global.glob_access_token;
        }else{
            token = await getAccessToken();
            global.glob_access_token = token;
        }
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        Promise.reject(error)
    }
);

export const apiLogin = (path,data) => {
	return Axios({
		method:'post',
        url:BASE_API + path,
        data:data
    })
    .then(res => res.data);
}

export const apiGet = (path) => {
	return Axios({
		method:'get',
        url:BASE_API+path
    }).then(res => res.data);
}

export const apiGetDownload = (path) => {
	return Axios({
		method:'get',
        url:BASE_API+path,
        responseType: 'blob',
    }).then(res => res);
}

export const apiPost = (path,data) => {
	return Axios({
		method:'post',
        url:BASE_API+path,
        data:data
    }).then(res => res.data);
}

export const apiPut = (path,data) => {
	return Axios({
		method:'put',
        url:BASE_API+path,
        data:data
    }).then(res => res.data);
}

export const apiDelete = (path) => {
	return Axios({
		method:'delete',
        url:BASE_API+path
    }).then(res => res.data);
}

export const apiPostFormData = (path,data) => {
    const options = {
        indices: true,
        nullsAsUndefineds: true,
        booleansAsIntegers: false,
    };
    const formData = objectToFormData(
        data,
        options
    );
	return Axios({
		method:'post',
        url:BASE_API+path,
        headers:{
            'content-type': 'multipart/form-data'
        },
        data:formData
    }).then(res => res.data);
}

export const apiPostFormDataMobile = (path,data) => {
    const options = {
        indices: true,
        nullsAsUndefineds: true,
        booleansAsIntegers: false,
    };
    const formData = objectToFormDataMobile(
        data,
        options
    );
    return Axios({
		method:'post',
        url:BASE_API+path,
        headers:{
            'content-type': 'multipart/form-data'
        },
        data:formData
	}).then(res => res.data);
}

export const apiUpload = (path,data,token) => {
    const formData = new FormData();
    formData.append('file',data.file);
    return Axios({
		method:'post',
        url:BASE_API+path,
        headers:{
            'content-type': 'multipart/form-data',
            'Authorization':'Bearer '+token
        },
        data:formData
	}).then(res => res.data);
}

export const apiUploadMulti = (path,data,token) => {
    const formData = new FormData();
    data.file.forEach(file => {
        formData.append('file',file);
    });
    return Axios({
		method:'post',
        url:BASE_API+path,
        headers:{
            'content-type': 'multipart/form-data',
            'Authorization':'Bearer '+token
        },
        data:formData
    }).then(res => res.data);
}