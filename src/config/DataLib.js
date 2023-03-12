import axios from 'axios';

const apiUrl = "http://125.130.84.184:5000"
// const apiUrl = "http://127.0.0.1:5000";

// get my date days
function getMyDateDays(monthKey) {
    return axios.get(apiUrl + "/get_my_dating_list" , {
        params : {
            month : monthKey,
        }
    })
    .then((response) => {
        let responseData = response.data[0];

        if(Object.keys(responseData).length === 0) {
            let year = monthKey.split('-')[0];
            let month = monthKey.split('-')[1];
            let emptyMonthStr = '0'.repeat(new Date(year, month, 0).getDate());
            return emptyMonthStr;
        } else {
            return responseData[0];
        }
    })
    .catch((error) => {
        console.log('err', error);
    });
}

// set my date days
function setMyDateDays(month, my_dating_days) {
    return axios.post(apiUrl + "/set_my_dating_day", null, {
        params : {
            month: month,
            my_dating_days : my_dating_days
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