import axios from 'axios';

const apiUrl = "http://125.130.84.184:5000"
// const apiUrl = "http://127.0.0.1:5000";

// get my date days
function getMyDateDays(db_name, month) {
    return axios.get(apiUrl + "/get_my_date_days" , {
        params : {
            dbname : db_name,
        }
    })
    .then((response) => {
        return response.data[0][0];
    })
    .catch((error) => {
        console.log('err', error);
    });
}

// set my date days
function setMyDateDays(db_name, month, my_date_days) {
    return axios.post(apiUrl + "/set_my_date_days", null, {
        params : {
            dbname : db_name,
            month: month,
            my_date_days : my_date_days
        }
    })
    .then((response) => {
        return response.data[0];
    })
    .catch((error) => {
        console.log('err', error);
    });
}

export default {
    getMyDateDays,
    setMyDateDays,
};