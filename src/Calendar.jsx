import React, {useState, useEffect}  from 'react';

import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './Calendar.css'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';

function Calendar() {
    
    const disableDays = [
        {from: new Date(2023, 1, 1), to: new Date(2023, 1, 9)}
    ]

    let specialDay = {
        metDays : [
            new Date(2023, 1, 10),
            new Date(2023, 1, 14),
            new Date(2023, 1, 22),
            new Date(2023, 1, 26),
            new Date(2023, 1, 28),
            new Date(2023, 2, 1),
            new Date(2023, 2, 5),
        ],
    }

    const specialDayStyle = {
        metDays : {
            border:"solid 1px #ffaa00",
            borderRadius:'50%',
        },
    }

    const [selectedDay, setSelectedDay] = useState("");

    function handleDayClick(date,  {selected}) {
        if(selected === undefined) {
            setSelectedDay(date);
        }
    }

    function getDiffDays(targetDate) {
        const firstDay = new Date(2023, 1, 10);
        let diffDays = (targetDate - firstDay) / (1000 * 60 * 60 * 24);
        return parseInt(diffDays) + 1;
    }

    function makeDateToString(date) {
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let year = date.getFullYear()
        let dateString = year + '-'+ month  + '-' + day;

        return dateString;
    }

    function isAnniversaryDay(date) {
        let dayDiff = getDiffDays(date);
        if (dayDiff % 100 === 0) return true;
        if (date.getMonth() === 1 && date.getDate() === 10) return true;
        return false
    }

    return (
        <div className="main">
            <h1>🧞 🤍 👸🏼</h1>
            <div className="day-picker">
                <DayPicker
                    mode="single"
                    captionLayout="dropdown-buttons"
                    onDayClick={handleDayClick}
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
                    <>
                        <span>[ TODAY ]<br/>
                            <span>
                                <b id="d-day">{getDiffDays(new Date())}</b> 일
                                {isAnniversaryDay(new Date()) && <span> 🎉</span>}
                            </span>
                        </span>
                    </>
                    :
                    <span>[ {makeDateToString(selectedDay)} ]<br/>
                        <span>
                            <b id="d-day">{getDiffDays(selectedDay)}</b> 일
                            {isAnniversaryDay(selectedDay) && <span> 🎉</span>}
                        </span>
                        <FormGroup className="date-checkbox-container">
                            {/* <FormControlLabel id="checkbox" control={<Checkbox  />} label="Label" /> */}
                            <Checkbox
                                style={{color:"#ffaa00"}} 
                                icon={<FavoriteBorder />} 
                                checkedIcon={<Favorite />}
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 36 } }}
                                />
                            <span>hello</span>
                        </FormGroup>
                    </span>
                }
            </div>
        </div>
      );
}

export default Calendar;