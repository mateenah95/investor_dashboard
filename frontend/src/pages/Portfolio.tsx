import React from 'react';
import Navbar from '../components/Navbar';
import {ShoppingCart, Receipt, DollarSign, ArrowLeftRight, BadgePercent, ChartCandlestick, Calculator, ArrowBigUpDash, Award} from 'lucide-react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import constants from '../constants';
import { Chart } from "react-google-charts";
import { toast } from 'react-toastify';


const chartData = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
];

const performanceData = [
    ['Year', 'Value'],
    [2021, 16231],
    [2022, 24167],
    [2023, 61889],
    [2024, 117556],
    [2025, 154129]
];

const chartOptions = {
    pieHole: 0.3,
    is3D: true,
    slices: {
      1: { offset: 0.2 },
    },
    pieStartAngle: 50,
    sliceVisibilityThreshold: 0.25,
    legend: {
        position: "bottom",
        alignment: "center",
        textStyle: {
        color: "#233238",
        fontSize: 20,
    },
    },
};

const Portfolio = () => {
    const { user, setUser } = React.useContext(UserContext);
    const navigate = useNavigate();

    const [totalBuys, setTotalBuys] = React.useState(0);
    const [totalSells, setTotalSells] = React.useState(0);
    const [totalInvestment, setTotalInvestment] = React.useState(0);

    const [stockBuys, setStockBuys] = React.useState(0);
    const [stockSells, setStockSells] = React.useState(0);
    const [stockInvestment, setStockInvestment] = React.useState(0);

    const [cryptoBuys, setCryptoBuys] = React.useState(0);
    const [cryptoSells, setCryptoSells] = React.useState(0);
    const [cryptoInvestment, setCryptoInvestment] = React.useState(0);

    const [topStockHoldings, setTopStockHoldings] = React.useState([]);
    const [topCryptoHoldings, setTopCryptoHoldings] = React.useState([])

    const [investmentOverTimeChartData, setInvestmentOverTimeChartData] = React.useState([['Year', 'Amount'],]);

    const [investmentOverTimeCumulativeChartData, setInvestmentOverTimeCumulativeChartData] = React.useState([['Year', 'Amount'],]);

    const assetTypeChartData = [
        ['Asset Type', 'Value'], 
        ['Stocks', stockInvestment], 
        ['Crypto', cryptoInvestment]
    ];

    const tickerChartData = [];

    const [tickerCounter, setTickerCounter] = React.useState(0);
    const [transactionCount, setTransactionCount] = React.useState(0);

    const getPortfolioSummary = () => {
        axios.get(`${constants.API_URL}/portfolio`, {
            headers: {
                'Authorization': user.token
            }
        })
        .then(response => {
            setTotalBuys(parseFloat(response.data.portfolio.total_buys.toFixed(2)));
            setTotalSells(parseFloat(response.data.portfolio.total_sells.toFixed(2)));
            setTotalInvestment(parseFloat(response.data.portfolio.total_investment.toFixed(2)));
            setStockBuys(parseFloat(response.data.portfolio.stock_buys.toFixed(2)));
            setStockSells(parseFloat(response.data.portfolio.stock_sells.toFixed(2)));
            setStockInvestment(parseFloat(response.data.portfolio.stock_investment.toFixed(2)));
            setCryptoBuys(parseFloat(response.data.portfolio.crypto_buys.toFixed(2)));
            setCryptoSells(parseFloat(response.data.portfolio.crypto_sells.toFixed(2)));
            setCryptoInvestment(parseFloat(response.data.portfolio.crypto_investment.toFixed(2)));
            // setTickerCounter(Object.keys(response.data.portfolio.group_by_ticker).length);
            setTransactionCount(response.data.portfolio.transaction_count);

            setTopStockHoldings(response.data.portfolio.top_stock_holdings);
            setTopCryptoHoldings(response.data.portfolio.top_crypto_holdings);

            setInvestmentOverTimeChartData([...investmentOverTimeChartData, ...response.data.portfolio.investment_over_time]);

            setInvestmentOverTimeCumulativeChartData([...investmentOverTimeCumulativeChartData, ...response.data.portfolio.investment_over_time_cumulative]);

            toast.success('Successfully fetched portfolio data.');

        })
        .catch(error => {
            console.error('Error fetching portfolio summary:', error);
            if (error.response && error.response.status == 401) {
                toast.error(error.response.data.error);
                setUser(null);
                navigate('/login');
            }
            else {
                toast.error('Error fetching portfolio summary. Please see console logs for error info.');
            }
        })
    }

    React.useEffect(() => {
        if (!user) {
            console.error('User not logged in');
            navigate('/login');
        }
        getPortfolioSummary();
    }, [user]);

    return (
        <div className='w-100 h-100'>
            <Navbar />
            <br />
            <div className='container-fluid text-center'>
                <h3 className='fw-bold'>Portfolio Summary</h3>
                <p>You can view a summary of your portfolio here.</p>
                <br />
                <div className='card p-3 bg-light'>
                    <div className='row'>
                        <div className='col-3 card p-3 m-3 bg-success-subtle text-center text-success'>
                            <br />
                            <ShoppingCart className='lucide lucide-shopping-cart m-auto ' size={50} />
                            <br />
                            <h4>Total Buys</h4>
                            <h5>${totalBuys}</h5>
                            <i data-lucide="shopping-cart"></i>
                        </div>
                        <div className='col-3 card p-3 m-3 bg-danger-subtle text-center text-danger'>
                            <br />
                            <Receipt className='lucide lucide-receipt m-auto' size={50} />
                            <br />
                            <h4>Total Sells</h4>
                            <h5>${totalSells}</h5>
                        </div>
                        <div className='col card  p-3 m-3 bg-success text-center text-white'>
                            <br />
                            <Calculator className='lucide lucide-receipt m-auto' size={50} />
                            <br />
                            <h4>Total Profit</h4>
                            <h5>${(totalInvestment + (totalInvestment*0.10)).toFixed(2)}</h5>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col card m-3 p-3 bg-primary text-center text-white'>
                            <br />
                            <ChartCandlestick className='lucide lucide-dollar-sign m-auto' size={50} />
                            <br />
                            <h3>Net Investment</h3>
                            <h5>${totalInvestment}</h5>
                        </div>
                            <div className='col card m-3 p-3 bg-warning text-center text-white'>
                            <br />
                            <BadgePercent className='lucide lucide-dollar-sign m-auto' size={50} />
                            <br />
                            <h3>Portfolio Value</h3>
                            <h5>${(totalInvestment + (totalInvestment*0.12)).toFixed(2)}</h5>
                        </div>
                    </div>
                </div>
                <br />
                <h3 className='fw-bold text-center'>Portfolio Breakdown</h3>
                <p className='text-center'>Here you can view a breakdown of you portfolio by asset type.</p>
                <br />
                <Chart
                    chartType="PieChart"
                    data={assetTypeChartData}
                    options={chartOptions}
                    height={"500px"}
                />
                <div className='container-fluid p-3 bg-light' style={{width: '100vw'}}>
                    <div className='row'>
                        <div className='col card bg-white m-3 p-5'>
                            <h4 className='fw-bold'>Stocks</h4>
                            <p>Stock Investments Breakdown</p>
                            <hr />
                            <div className='row'>
                                <div className='col card m-3 p-3 bg-success-subtle text-center text-success'>
                                    <br />
                                    <ShoppingCart className='lucide lucide-dollar-sign m-auto' size={50} />
                                    <br />
                                    <h3>Stock Buys</h3>
                                    <h5>${stockBuys}</h5>
                                </div>
                                <div className='col card m-3 p-3 bg-danger-subtle text-center text-danger'>
                                    <br />
                                    <Receipt className='lucide lucide-dollar-sign m-auto' size={50} />
                                    <br />
                                    <h3>Stock Sells</h3>
                                    <h5>${stockSells}</h5>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col card m-3 p-3 bg-primary-subtle text-center'>
                                    <br />
                                    <DollarSign className='lucide lucide-dollar-sign m-auto' size={50} />
                                    <br />
                                    <h3>Net Stock Investment</h3>
                                    <h5>${stockInvestment}</h5>
                                </div>
                            </div>
                            <hr />
                            <br />
                            <h4 className='fw-bold'>Top Stock Holding</h4>
                            <p>Here you can view your top 3 stock holdings (by investment amount).</p>
                            <hr />
                            <div className='row'>
                                <div className='col'>
                                    {
                                        topStockHoldings.map(el => (
                                            <div className='d-flex justify-content-between border rounded p-3 pt-5 m-3'>
                                                <ArrowBigUpDash className='' size={50} color={'green'}/>
                                                <p className='mx-3 fw-bold mt-2'>{el[0]}</p>
                                                <p className='badge rounded-pill bg-success p-2 p-3 fw-bold'>{((el[1] / stockInvestment) * 100).toFixed(2)}%</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <hr />
                        </div>
                        <div className='col card bg-white m-3 p-5'>
                            <h4 className='fw-bold'>Crypto</h4>
                            <p>Crypto Investments Breakdown</p>
                            <hr />
                            <div className='row'>
                                <div className='col card m-3 p-3 bg-success-subtle text-center text-success'>
                                    <br />
                                    <ShoppingCart className='lucide lucide-dollar-sign m-auto' size={50} />
                                    <br />
                                    <h3>Crypto Buys</h3>
                                    <h5>${cryptoBuys}</h5>
                                </div>
                                <div className='col card m-3 p-3 bg-danger-subtle text-center text-danger'>
                                    <br />
                                    <Receipt className='lucide lucide-dollar-sign m-auto' size={50} />
                                    <br />
                                    <h3>Crypto Sells</h3>
                                    <h5>${cryptoSells}</h5>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col card m-3 p-3 bg-primary-subtle text-center'>
                                    <br />
                                    <DollarSign className='lucide lucide-dollar-sign m-auto' size={50}/>
                                    <br />
                                    <h3>Net Crypto Investment</h3>
                                    <h5>${cryptoInvestment}</h5>
                                </div>
                            </div>
                            <hr />
                            <br />
                            <h4 className='fw-bold'>Top Crypto Holding</h4>
                            <p>Here you can view your top 3 stock holdings (by investment amount).</p>
                            <hr />
                            <div className='row'>
                                <div className='col'>
                                    {
                                        topCryptoHoldings.map(el => (
                                            <div className='d-flex justify-content-between border rounded p-3 pt-5 m-3'>
                                                <ArrowBigUpDash className='' size={50} color={'green'}/>
                                                <p className='mx-3 fw-bold mt-2'>{el[0]}</p>
                                                <p className='badge rounded-pill bg-success p-3 fw-bold'>{ ((el[1] / cryptoInvestment) * 100).toFixed(2) }%</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <hr />
                        </div>
                    </div>
                    <br />
                    <h3 className='fw-bold text-center'>Investment Over Time</h3>
                    <p className='text-center'>Here you can view a breakdown of your investment history over time.</p>
                    <div className='row'>
                        <div className='col-6 mx-auto p-5'>
                            <p>Investment Over Time ($)</p>
                            <Chart
                            chartType="ColumnChart"
                            data={investmentOverTimeChartData}
                            height={"500px"}
                            />
                        </div>
                        <div className='col-6 mx-auto p-5'>
                            <p>Investment Over Time Cumulative ($)</p>
                            <Chart
                            chartType="LineChart"
                            data={investmentOverTimeCumulativeChartData}
                            height={"500px"}
                            />
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    );
};

export default Portfolio;