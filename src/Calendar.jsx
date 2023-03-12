import React, {useState, useEffect}  from 'react';
import DataLib from './config/DataLib';
import {DayPicker} from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './Calendar.css'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Button from '@mui/material/Button';

function Calendar() {
    const [selectedDay, setSelectedDay] = useState("");
    const [isCheckedYes, setIsCheckedYes] = useState("no");
    const [isDatingDayString, setIsDatingDayString] = useState("");
    const [isDatingDayList, setIsDatingDayList] = useState([]);

    const disableDays = [
        {from: new Date(2023, 1, 1), to: new Date(2023, 1, 9)}
    ]

    let specialDay = {
        metDays : isDatingDayList
    }

    const specialDayStyle = {
        metDays : {
            border:"solid 1px #ffaa00",
            borderRadius:'50%',
        },
    }


    useEffect(() => {
        DataLib.getMyDateDays(makeDateToString(new Date()).slice(0,7))
            .then((data) => {
                setIsDatingDayString(data);
                let tmpList = []
                let dating_list = data.split("");
                let year = new Date().getFullYear();
                let month = new Date().getMonth();

                for (let i = 0; i < dating_list.length; i++) {
                    if (dating_list[i] === '1') {
                        tmpList.push(new Date(year, month, i+1))
                    }
                }
                setIsDatingDayList(tmpList);
            })
            .catch((error) => {
                console.log('err', error);
            });
    },[])

    function handleDayClick(date,  {selected}) {
        if(selected === undefined) {
            setSelectedDay(date);
            if(isDatingDayList.some(day => (date.toDateString() === day.toDateString()))) {
                setIsCheckedYes("yes");
            } else {
                setIsCheckedYes("no");
            }
        }
    }

    function handleMonthClick(date) {
        DataLib.getMyDateDays(makeDateToString(date).slice(0,7))
            .then((data) => {
                setIsDatingDayString(data);
                let tmpList = []
                let dating_list = data.split("");
                let year = date.getFullYear();
                let month = date.getMonth();

                for (let i = 0; i < dating_list.length; i++) {
                    if (dating_list[i] === '1') {
                        tmpList.push(new Date(year, month, i+1))
                    }
                }
                setIsDatingDayList(tmpList);
            })
            .catch((error) => {
                console.log('err', error);
            });
    }

    function getDiffDays(targetDate) {
        const firstDay = new Date(2023, 1, 10);
        let diffDays = (targetDate - firstDay) / (1000 * 60 * 60 * 24);
        return parseInt(diffDays) + 1;
    }

    function makeDateToString(timestamp) {
        let month = ('0' + (timestamp.getMonth() + 1)).slice(-2);
        let date = ('0' + timestamp.getDate()).slice(-2);
        let year = timestamp.getFullYear()
        let dateString = year + '-'+ month  + '-' + date;

        return dateString;
    }

    function makeDateToShortString(timestamp) {
        const week = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    
        let month = (timestamp.getMonth() + 1);
        let date = timestamp.getDate();
        let day = timestamp.getDay()
        let dateString = month + '/'+ date  + ' (' + week[day] + ')';

        return dateString;
    }

    function isAnniversaryDay(date) {
        let dayDiff = getDiffDays(date);
        if (dayDiff % 100 === 0) return true;
        if (date.getMonth() === 1 && date.getDate() === 10) return true;
        return false
    }

    function onChangeCheckbox(event) {
        const checkedValue = event.target.value;
        setIsCheckedYes(checkedValue);
    }

    function onClickSaveBtn() {
        let isCheckedYesToInt = isCheckedYes === "yes" ? '1' : '0';
        let targetIndex = selectedDay.getDate() - 1;
        let newDatingDayString = isDatingDayString.substring(0,targetIndex) + isCheckedYesToInt + isDatingDayString.substring(targetIndex+1);

        DataLib.setMyDateDays(makeDateToString(selectedDay).slice(0,7), newDatingDayString)
            .then((data) => {
                if (data["msg"] === 'success') {
                    alert('저장이 완료되었습니다.');
                    window.location.reload();
                } else {
                    alert('저장에 실패했습니다.');
                }
            })
            .catch((error) => {
                console.log('err', error);
            });
    }

    return (
        <div className="main">
            <h1>🧞 🤍 👸🏼</h1>
            <div className="day-picker">
                <DayPicker
                    mode="single"
                    selected={selectedDay}
                    captionLayout="dropdown-buttons"
                    onDayClick={handleDayClick}
                    onMonthChange={handleMonthClick}
                    // selectedDays={selectedDay}
                    disabled={disableDays}
                    fromMonth={new Date(2023, 1)}
                    toMonth={new Date(2999, 1)}
                    modifiers={specialDay}
                    modifiersStyles={specialDayStyle}
                />
            </div>
            <div className="calendar-contents">
                {
                    selectedDay === "" ? 
                    <span>[ TODAY ]<br/>
                        <span>
                            <b id="d-day">{getDiffDays(new Date())}</b> 일
                            {isAnniversaryDay(new Date()) && <span> 🎉</span>}
                        </span>
                    </span>
                    :
                    <span>[ {makeDateToString(selectedDay)} ]<br/>
                        <span>
                            <b id="d-day">{getDiffDays(selectedDay)}</b> 일
                            {isAnniversaryDay(selectedDay) && <span> 🎉</span>}
                        </span><br/>
                        {/* <FormControlLabel id="checkbox" control={<Checkbox  />} label="Label" /> */}
                        <div className="checkbox-container">
                            <span>Would (Did) you dating on <br/>{makeDateToShortString(selectedDay)} 😊?</span>
                            <FormGroup style={{display:"block"}}>
                                <FormControlLabel 
                                    control={
                                        <Checkbox 
                                            checked={isCheckedYes === "yes" ? true : false}
                                            value="yes"
                                            onChange={onChangeCheckbox}
                                            style={{color:"#ffaa00"}}
                                            icon={<FavoriteBorder />} 
                                            checkedIcon={<Favorite />}
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }}
                                        />}
                                    label="YES" />
                                <FormControlLabel 
                                    control={
                                        <Checkbox 
                                            checked={isCheckedYes === "no" ? true : false}
                                            value="no"
                                            onChange={onChangeCheckbox}
                                            style={{color:"#ffaa00"}}
                                            icon={<FavoriteBorder />} 
                                            checkedIcon={<Favorite />}
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 30 } }}
                                        />}
                                    label="NO" />
                            </FormGroup>
                            <Button id="save-btn" size="small" onClick={onClickSaveBtn}>SAVE</Button>
                        </div>
                    </span>
                }
            </div>
        </div>
      );
}

export default Calendar;