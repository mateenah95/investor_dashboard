import React from 'react';
import Navbar from '../components/Navbar';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FileText, Download, FileWarning } from 'lucide-react';
import constants from '../constants';
import { toast } from 'react-toastify';


const Reports = () => {
    const { user, setUser } = React.useContext(UserContext);
    const navigate = useNavigate();

    const [reports, setReports] = React.useState([]);
    const [year, setYear] = React.useState(new Date().getFullYear());

    const getPaginationYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear - i);
        }
        return years;
    };

    const fetchReports = () => {
        axios.get(`${constants.API_URL}/reports?year=${year}`, {
            headers: {
                'Authorization': user.token
            }
        })
        .then(response => {
            setReports(response.data.reports);
            toast.success('Successfully fetched reports data.');
        })
        .catch(error => {
            console.error('Error fetching reports:', error);
            if (error.response && error.response.status == 401) {
                toast.error(error.response.data.error);
                setUser(null);
                navigate('/login');
            }
            else {
                toast.error('Error fetching reports data. Please see console logs for error info.');
            } 
        });
    };

    React.useEffect(() => {
        if (!user) {
            console.error('User not logged in');
            navigate('/login'); // Redirect to login if user is not logged in
        } else {
            fetchReports();
        }
    }, [user, year]);

    return (
        <div className='w-100 h-100'>
            <Navbar />
            <br />
            <div className='container text-center'>
                <h3 className='fw-bold'>Quarterly Reports</h3>
                <p>You can download and view your quarterly reports here</p>
                <br />
                <div className='card p-4 bg-light'>
                    <div className='w-25 m-auto'>
                        <p>Year:</p>
                        <select className="form-select form-select-sm m-auto w-50" aria-label="Select report year" onChange={(e) => setYear(e.target.value)} value={year}>
                            {getPaginationYears().map((year_idx) => (
                                <option key={year_idx} value={year_idx} onSelect={(e) => {setYear(year_idx)}}>
                                    {year_idx}
                                </option>
                            ))}
                        </select>
                    </div>
                    <br />
                    <div className='row'>
                        {reports.map(report => (
                            <div className='col-6'>
                                <div className='card bg-success-subtle m-3 p-3 d-flex flex-column justify-content-between text-start' key={report.id} style={{ height: '175px' }}>
                                    <div className='d-flex justify-content-between'>
                                        <div className='d-flex'>
                                            <FileText className='me-3' size={50} />
                                            <div>
                                                <h4>{report.title}</h4>
                                                <p>Generated at: {new Date(report.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p>User: <b className='text-success'>{user.first_name} {user.last_name}</b></p>
                                    </div>
                                
                                    <a href={report.link} target="_blank" rel="noopener noreferrer" className='btn btn-primary'>
                                        <Download className='mx-2' />
                                        Download Report
                                    </a>
                                </div>
                            </div>
                        ))}
                        {!reports.length && <p className='badge rounded-pill bg-danger p-2 m-2 w-25 mx-auto'><FileWarning className='mx-2' />Year {year} has no available reports.</p>}
                    </div>
                </div>
            </div>  
        </div>
    );
};

export default Reports;