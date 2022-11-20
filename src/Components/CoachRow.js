import Seat from "./Seat";

const CoachRow = props => {
    const seats = [];
    const total = props.total;
    const full = total - props.left;
    
    for(let i = 1; i <= props.total; i++) {
        if(i <= full)
            seats.push(<Seat num = { props.start + i - 1 } key = { i } status = "1" />)
        else 
            seats.push(<Seat num = { props.start + i - 1 } key = { i } status = "0" />)
    }

    return (
        <div className = "w-full flex justify-center items-center gap-x-4 mb-1">
            {
                seats.map((seat) => {
                    return seat;
                })
            }
        </div>
    );
}

export default CoachRow;