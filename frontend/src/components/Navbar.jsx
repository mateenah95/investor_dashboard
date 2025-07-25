import React from 'react';
import { Link } from 'react-router';
import { UserContext } from '../contexts/UserContext';
import {Landmark, LogOut} from 'lucide-react';


const Navbar = () => {
    const {user, setUser} = React.useContext(UserContext);

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary w-100">
            <div className="container-fluid">
                <Landmark className='text-center mx-2' size={40} color={'darkorange'} />
                <a className="navbar-brand" href="#">Investor Dashboard</a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to={'/portfolio'} className="nav-link">Portfolio</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/transactions'} className="nav-link">Transactions</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/reports'} className="nav-link">Reports</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='d-flex flex-column py-1 px-3 text-nowrap mx-3'>
                <p className='w-100'>{user ? `Welcome  ${user.first_name} ${user.last_name}!` : 'Anonymous'}</p>
                {user && <button className="btn btn-outline-danger fw-bold p-2" onClick={() => setUser(null)}><LogOut className='mx-2' color={'red'} />Logout</button>}
            </div>
        </nav>
    );
};

export default Navbar;