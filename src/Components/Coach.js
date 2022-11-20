import { useEffect, useState } from 'react';
import CoachRow from "./CoachRow";

const Coach = () => {
    const [seats, updateSeats] = useState(localStorage.getItem("arrangement") === null ? [] : JSON.parse(localStorage.getItem("arrangement")));

    const getStatus = async () => {
        const response = await fetch(`${process.env.REACT_APP_SERVER}/api/seats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        let data = await response.json();

        if(JSON.stringify(seats) !== JSON.stringify(data.arrangement)) {
            updateSeats(seats => {
                localStorage.setItem("arrangement", data.arrangement);
                return JSON.parse(data.arrangement);
            });
        }
    }

    useEffect(() => {
        const loop = setInterval(() => {
            getStatus();
        }, 5000);
        
        return (() => { 
            clearInterval(loop);
        })
    });

    let count = 1;

    return (
        <div className = "flex flex-col justify-center items-center grow">
            {
                seats.length === 0 ? "Loading Information About Coach." : seats.map((seat) => {
                    count += seat.total;
                    return <CoachRow start = { count - seat.total } key = {seat.row + "_" + seat.id} row = { seat.row } total = { seat.total } left = { seat.left }></CoachRow>
                })
            }
        </div>
    );
}

export default Coach;