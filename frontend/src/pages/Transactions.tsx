import React from 'react';
import Navbar from '../components/Navbar';
import {ShoppingCart, Receipt, DollarSign, ArrowLeftRight} from 'lucide-react'
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import constants from '../constants';
import { toast } from 'react-toastify';


const Transactions = () => {
    const [transactions, setTransactions] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [pageCount, setPageCount] = React.useState(0);
    const { user,setUser } = React.useContext(UserContext);
    const navigate = useNavigate();

    const getTransactions = () => {
        axios.get(`${constants.API_URL}/transactions?page=${page}`, {
            headers: {
                'Authorization': user.token
            }
        })
        .then(response => {
            setTransactions(response.data.transactions);
            setPageCount(response.data.pageCount);
            toast.success('Successfully fetched transaction data.');
        })
        .catch(error => {
            console.error('Error fetching transactions:', error);
            if (error.response && error.response.status == 401) {
                toast.error(error.response.data.error);
                setUser(null);
                navigate('/login');
            }
            else {
                toast.error('Error fetching transactions data. Please see console logs for error info.');
            } 
        })
    }

    React.useEffect(() => {
        if (!user) {
            console.error('User not logged in');
            navigate('/login'); // Redirect to login if user is not logged in
        }
        getTransactions();
    }, [user, page]);

    return (
        <div className='w-100 h-100'>
            <Navbar />
            <br />
            <div className='container-fluid text-center bg-light p-5'>
                <h3 className='fw-bold'>Transaction History</h3>
                <p>Here you can view your transaction history.</p>
                <br />
                <div className='card p-3'>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Asset Type</th>
                                <th>Transaction Type</th>
                                <th>Ticker</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Value</th>
                                <th>Date-Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.type}</td>
                                    <td>{transaction.transaction_type === 'buy' ? <span className="badge rounded-pill text-bg-success p-2">Buy</span> : <span className="badge rounded-pill text-bg-danger p-2">Sell</span>}</td>
                                    <td>{transaction.ticker}</td>
                                    <td>{transaction.quantity}</td>
                                    <td>${transaction.price}</td>
                                    <td>${(transaction.quantity * transaction.price).toFixed(2)}</td>
                                    <td>{transaction.created_at ? new Date(transaction.created_at).toLocaleString() : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='w-25 m-auto'>
                        <p>Pagination Page:</p>
                        <select className="form-select form-select-sm m-auto w-50" aria-label="Select page number" onChange={(e) => setPage(e.target.value)} value={page}>
                            {[...Array(pageCount).keys()].map((pageNum) => (
                                <option key={pageNum} value={pageNum + 1} onSelect={(e) => {setPage(pageNum + 1)}}>
                                    Page {pageNum + 1} of {pageCount}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>    
        </div>
    );
};

export default Transactions;