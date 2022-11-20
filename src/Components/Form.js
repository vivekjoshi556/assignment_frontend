import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import BookingRow from './BookingRow';

const Form = props => {
    const [loading, setLoading] = useState(false); // Implies whether there is a pending request or not.
    const [bookings, updateBookings] = useState(localStorage.getItem("bookings") === null ? {} : JSON.parse(localStorage.getItem("bookings")));

    const test = async (e) => {
        // Stop Page Submission.
        e.preventDefault();
        
        // If there is an ongoing request.
        if(loading) {
            toast.error("A Request is already under Process.");
            return;
        }

        // No on going request. Set state to loading.
        setLoading(true);
        const val = document.getElementById("num_passengers").value; // Get input value.

        document.getElementById("num_passengers").disabled = true;
        // Send Request
        const response = await fetch(`${process.env.REACT_APP_SERVER}/api/bookSeats`, {
            method: "POST",
            body: JSON.stringify({
                num_seats: val
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        });

        // Enable Input.
        document.getElementById("num_passengers").disabled = false;
        // Get out of loading state.
        setLoading(false);

        // Process Data.
        let data = await response.json();

        // Check if the response is a success response or not.
        if(response.status !== 200 || data.status === "error")
            toast.error(data.message);
        else if(data.status === "success") {
            // If the task was successful.
            document.getElementById("num_passengers").value = "";

            // Update the bookings
            updateBookings(() => {
                localStorage.setItem("bookings", JSON.stringify(data.seats));
                return data.seats;
            });
            
            toast.success("Thank you for you patience. Your seats were booked successfully.");
        }
    }

    const getBookings = async () => {
        const response = await fetch(`${process.env.REACT_APP_SERVER}/api/bookings`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        })
        
        const data = await response.json();

        if(data !== JSON.stringify(bookings)) {
            updateBookings(bookings => {
                if(Object.keys(data).length === 0) {
                    localStorage.removeItem("bookings");
                    return [];
                }

                localStorage.setItem("bookings", data);
                return JSON.parse(data);
            });
        }
    }

    useEffect(() => {
        getBookings();
    }, []);

    return (
        <div className = "flex justify-center ml-4 px-3 grow flex-col mt-20">
            <h2 className = "text-2xl text-stone-700 mb-5 text-center">Book Train Seats</h2>
            <br/>
            <form onSubmit = { test }>
                <div className = "w-full">
                    <label className = "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor = "num_passengers">
                        Number of Passengers
                    </label>
                    <input required className = "appearance-none block w-full bg-gray-50 text-gray-800 border border-gray-200 rounded py-3 px-4 text-sm leading-tight focus:outline-none" type = "number" min = "1" placeholder="Number of Passengers" id = "num_passengers" autoFocus />

                    {
                        loading &&
                        <button className = "flex justify-center items-center bg-orange-400 hover:bg-orange-500 duration-400 mt-3 float-right text-sm text-white py-2 px-2 rounded cursor-not-allowed">
                            <div className = "inline mr-1" aria-label="Loading..." role="status">
                                <svg className = "h-5 w-5 animate-spin stroke-white duration-1000" viewBox="0 0 256 256">
                                    <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                                    <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                                    <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                                    <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                                    <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                                    <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                                    <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                                    <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line>
                                </svg>
                            </div>
                            Book Seats
                        </button>
                    }
                    {
                        !loading &&
                        <button className = "flex justify-center items-center bg-orange-400 hover:bg-orange-500 duration-400 mt-3 float-right text-sm text-white py-2 px-2 rounded">
                            Book Seats
                        </button>
                    }
                </div>
            </form>
            <hr className = "my-4" />
            <div className = "mb-10">
                <h3 className = "mb-2">Current Bookings</h3>
                <table className = "border-separate table-auto w-full text-sm rounded-xl border max-h-40 overflow-y-scroll">
                    <thead>
                        <tr>
                            <th className = "border-b font-medium p-4 pl-8 py-2 text-slate-800 text-left" >Row-ID</th>
                            <th className = "border-b font-medium p-4 py-2 text-slate-800 text-left" >Seats</th>
                        </tr>
                    </thead>
                    <tbody className = "bg-white">
                        {
                            Object.keys(bookings).length === 0 ? <BookingRow row_id = "-1" /> : Object.keys(bookings).map((val, idx) => {
                                return <BookingRow key = { idx } row_id = { val } seats = { bookings[val] } />
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Form;