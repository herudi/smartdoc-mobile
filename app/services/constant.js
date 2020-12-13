export const BASE_URL = 'http://103.195.30.154:8003/';
export const primaryColor = '#009933';
export const blueColor = '#2975BA';
export const primaryDarkColor = '#009933';
export const successColor = '#28a745';
export const warningColor = '#e64a19';
export const unguColor = '#6a1b9a';
export const infoColor = '#17a2b8';
export const whiteColor = '#fcfcfc';
export const dangerColor = '#ff4d4f';
export const defaultRippleColor = 'rgba(167, 166, 166, 0.61)';
export const defaultGrayColor = '#c2c2c2';
export const moduleDisposition = "dispositions";
export const moduleIncoming = "incoming-mails";
export const moduleDispositionFollowUp = "dispositions-follow";
export const moduleApproval = "outgoing-mails-approval";
export const moduleSigned = "outgoing-mails-signed";


export const testChildDispo = {
    "data": [
        {
            "id": 8,
            "incoming_mail": {
                "id": 2,
                "subject_letter": "Testing Surat Masuk",
                "number_letter": "001/12/2010"
            },
            "number_disposition": "0002/DISPO-DKU/BIJB/08/2020",
            "subject_disposition": "Testing Surat Masuk",
            "disposition_date": "2020-08-02",
            "description": "OK",
            "employee": {
                "id": 2,
                "name": "Muhammad Singgih"
            },
            "assigns": [
                {
                    "id": 8,
                    "structure": {
                        "id": 32,
                        "name": "Accounting & Finance"
                    },
                    "employee": {
                        "id": 26,
                        "name": "Catur Sawisti Rangkuti"
                    },
                    "class_disposition": {
                        "id": 9,
                        "name": "Siapkan Bahan"
                    },
                    "is_read": 0,
                    "follow_up": {
                        "id": 6,
                        "dispositions_assign_id": 8,
                        "employee_id": 26,
                        "description": "Tindak lanjut surat masuk ini otomatis dilakukan oleh sistem. User Melakukan Re - Disposisi dengan nomor surat 0003/DISPO-AF/BIJB/08/2020",
                        "path_to_file": null,
                        "status": 1,
                        "created_at": "2020-08-02 20:53:42",
                        "updated_at": "2020-08-02 20:53:42"
                    }
                }
            ],
            "is_redisposition": 1,
            "status": 2,
            "progress": "1 / 1",
            "children": [
                {
                    "id": 11,
                    "incoming_mail": {
                        "id": 2,
                        "subject_letter": "Testing Surat Masuk",
                        "number_letter": "001/12/2010"
                    },
                    "number_disposition": "0003/DISPO-AF/BIJB/08/2020",
                    "subject_disposition": "Testing Surat Masuk",
                    "disposition_date": "2020-08-02",
                    "description": "BABA",
                    "employee": {
                        "id": 26,
                        "name": "Catur Sawisti Rangkuti"
                    },
                    "assigns": [
                        {
                            "id": 11,
                            "structure": {
                                "id": 39,
                                "name": "Accounting & Asset Management"
                            },
                            "employee": {
                                "id": 27,
                                "name": "Intan Noor Annisa"
                            },
                            "class_disposition": {
                                "id": 1,
                                "name": "Untuk Diketahui"
                            },
                            "is_read": 1,
                            "follow_up": {
                                "id": 7,
                                "dispositions_assign_id": 11,
                                "employee_id": 27,
                                "description": "OK",
                                "path_to_file": null,
                                "status": 1,
                                "created_at": "2020-08-02 20:59:35",
                                "updated_at": "2020-08-02 20:59:35"
                            }
                        }
                    ],
                    "is_redisposition": 1,
                    "status": 4,
                    "progress": "1 / 1",
                    "children": null
                }
            ]
        }
    ]
}
