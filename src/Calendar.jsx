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
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';

function Calendar() {

    const [selectedDay, setSelectedDay] = useState("");
    const [isCheckedYes, setIsCheckedYes] = useState("no");
    const [isDatingDayString, setIsDatingDayString] = useState("");
    const [isDatingDayList, setIsDatingDayList] = useState([]);
    const [datingMemo, setDatingDayMemo] = useState("");

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
            setDatingDayMemo("");
            if(isDatingDayList.some(day => (date.toDateString() === day.toDateString()))) {
                setIsCheckedYes("yes");
                DataLib.getMyDateMemo(makeDateToString(date))
                    .then((data) => {
                        setDatingDayMemo(data)
                    })
                    .catch((error) => {
                        console.log('err', error);
                        setDatingDayMemo("");
                    });
            } else {
                setIsCheckedYes("no");
                setDatingDayMemo("");
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
        if (date.getMonth() === 10 && date.getDate() === 15) return true;
        if (date.getMonth() === 9 && date.getDate() === 28) return true;
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

    function onTextSaveButton() {
        DataLib.setMyDateMemo(makeDateToString(selectedDay), datingMemo)
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
                            {(isCheckedYes === "yes") && !isAnniversaryDay(selectedDay) && <span> 🧡</span>}
                        </span>
                    </span>
                    :
                    <span>[ {makeDateToString(selectedDay)} ]<br/>
                        <span>
                            <b id="d-day">{getDiffDays(selectedDay)}</b> 일
                            {isAnniversaryDay(selectedDay) && <span> 🎉</span>}
                            {(isCheckedYes === "yes") && !isAnniversaryDay(selectedDay) && <span> 🧡</span>}
                        </span>
                    </span>
                }
                {
                    (selectedDay !== "" && selectedDay >= new Date(new Date().setDate(new Date().getDate() - 2))) &&
                    <span>
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
                {
                    (selectedDay !== "") && 
                    (selectedDay < new Date(new Date().setDate(new Date().getDate() - 2))) &&
                    (isCheckedYes === "yes") && 
                    <div className='memo-div'>
                        <TextField
                            style={{width:"80%"}}
                            label="MEMO"
                            multiline
                            value={datingMemo}
                            onChange={(e) => setDatingDayMemo(e.target.value)}
                            InputProps={{
                                endAdornment :
                                <IconButton onClick={onTextSaveButton}>
                                    <SaveIcon style={{color: "white"}}/>
                                </IconButton>
                            }}
                            sx={{
                                "& .MuiInputBase-root": {
                                    color: 'white',
                                    '& fieldset': {
                                        borderColor: 'white',
                                      },
                                    '&:hover fieldset': {
                                        borderColor: "white"
                                    },
                                },
                                "& .MuiInputLabel-root" : {
                                    color : 'white'
                                },
                                "& input": {
                                    color: 'white'
                                },
                                "& .MuiFormLabel-root.Mui-focused": {
                                    color: 'white',
                                },
                                '& .MuiFormLabel-root.Mui-disabled': {
                                    color: 'white',
                                },
                                '& input:valid + fieldset' :{
                                    borderColor: "white"
                                }
                            }}
                        />
                    </div>
                }
            </div>
        </div>
      );
}

export default Calendar;