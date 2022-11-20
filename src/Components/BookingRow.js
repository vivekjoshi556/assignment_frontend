const BookingRow = props => {
    const defaultClass = "border-b border-slate-200 py-2 text-slate-700";
    // If there were no bookings found.
    if(props.row_id == -1) {
        return (
            <tr colSpan = "2"> 
                <td className = { defaultClass + " pl-8" }>No Seats Booked yet.</td> 
            </tr>
        );
    }

    return (
        <tr> 
            <td className = { defaultClass + " px-8" }>{ props.row_id }.</td> 
            <td className = { defaultClass + " pl-4 pr-8" }>{ 
                props.seats.map((val, idx) => {
                    if(idx === props.seats.length - 1)
                        return <span key = { idx }>{ val }</span>
                    return <span key = { idx }>{ val }, </span>
                })
            }</td>
        </tr>
    );
}

export default BookingRow;