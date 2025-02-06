/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'

import './App.css'
import DatePicker from 'react-datepicker'
import { Portal } from 'react-overlays'

import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import axios from 'axios'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import Login from './login'
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value, label } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 10
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}> */}
      {/* {payload.name} */}
      {/* </text> */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.color}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle + 3}
        endAngle={endAngle - 3}
        innerRadius={outerRadius + 7}
        outerRadius={outerRadius + 12}
        // fill={fill}
        fill={payload.color}
        // fill="none"
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill='none' />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text x={ex + (cos >= 0 ? 1 : -1) * 4} y={ey} textAnchor={textAnchor} fill='#fff000'>{`${label}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1)} y={ey} dy={18} textAnchor={textAnchor} fill='#fff000'>
        {`(${value}%)`}
      </text>
    </g>
  )
}
interface thongkexe {
  Thu: string
  Ngay: string
  Chinh_Xac: string
  K_Chinh_Xac: string
  K_Doc_Duoc: string
}
interface thongketheomay {
  MAIN: string
  TBIN: string
  TBOUT: string
}

const duoi30 = new Date()
duoi30.setDate(duoi30.getDate() - 29)
const currentDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
function App() {
  const [activeIndex] = useState([0, 1, 2])
  const [Total_Car, setTotal_Car] = useState(0)
  // const [Total_Car_Read, setTotal_Car_Read] = useState(0);
  const [Total_Car_Unread, setTotal_Car_Unread] = useState(0)
  const [Total_Car_Read_Correct, setTotal_Car_Read_Correct] = useState(0)
  const [Total_Car_Read_Incorrect, setTotal_Car_Read_Incorrect] = useState(0)
  const [Total_Car_In, setTotal_Car_In] = useState(0)
  const [Total_Car_Out, setTotal_Car_Out] = useState(0)
  const [Total_Car_WrongRule, setTotal_Car_WrongRule] = useState(0)
  const [Total_Car_Customer, setTotal_Car_Customer] = useState(0)
  const [Total_Car_Strange, setTotal_Car_Strange] = useState(0)
  const [Total_Car_Lock, setTotal_Car_Lock] = useState(0)
  const [Total_Car_Week, setTotal_Car_Week] = useState<thongkexe[]>([])
  const [Total_Car_Month, setTotal_Car_Month] = useState<thongkexe[]>([])
  const [TBMachine, setTBMachine] = useState<thongketheomay[]>([])

  const [startDate, setStartDate] = useState(currentDate)
  const User_ID = localStorage.Login ? true : false

  const IPserver = 'http://192.168.30.231:6969'

  const [checkLogin, setCheckLogin] = useState(User_ID)
  let retryCountday = 0
  let retryCountweek = 0
  let retryCountmonth = 0
  let retryCountMachine = 0
  const retryDelay = 120000 //2 phút
  // const datak = [
  //   {
  //     name: 'Page A',
  //     uv: 590,
  //     pv: 800,
  //     amt: 1400,
  //     cnt: 490
  //   },
  //   {
  //     name: 'Page B',
  //     uv: 868,
  //     pv: 967,
  //     amt: 1506,
  //     cnt: 590
  //   },
  //   {
  //     name: 'Page C',
  //     uv: 1397,
  //     pv: 1098,
  //     amt: 989,
  //     cnt: 350
  //   },
  //   {
  //     name: 'Page D',
  //     uv: 1480,
  //     pv: 1200,
  //     amt: 1228,
  //     cnt: 480
  //   },
  //   {
  //     name: 'Page E',
  //     uv: 1520,
  //     pv: 1108,
  //     amt: 1100,
  //     cnt: 460
  //   },
  //   {
  //     name: 'Page F',
  //     uv: 1400,
  //     pv: 680,
  //     amt: 1700,
  //     cnt: 380
  //   }
  // ]

  const data2 = [
    {
      name: 'OK',
      value: parseFloat(
        ((Total_Car_Unread / (Total_Car_Unread + Total_Car_Read_Correct + Total_Car_Read_Incorrect)) * 100).toFixed(2)
      ),
      label: 'UNREADABLE',
      color: '#FF4500'
    },
    {
      name: 'OK',
      value: parseFloat(
        (
          (Total_Car_Read_Correct / (Total_Car_Unread + Total_Car_Read_Correct + Total_Car_Read_Incorrect)) *
          100
        ).toFixed(2)
      ),
      label: 'CORRECT',
      color: '#00FF02'
    },
    {
      name: 'OK',
      value: parseFloat(
        (
          (Total_Car_Read_Incorrect / (Total_Car_Unread + Total_Car_Read_Correct + Total_Car_Read_Incorrect)) *
          100
        ).toFixed(2)
      ),
      label: 'INCORRECT',
      color: '#FDF5E6'
    }
  ]

  const login = localStorage.getItem('Login')
  // const [Factory, setFactory] = useState<'LHG' | 'JZS' >(login)
  const [Factory, setFactory] = useState('')

  useEffect(() => {
    // Log the value from localStorage for debugging
    // console.log('localStorage.Login:', login);

    // Set the initial state based on localStorage
    setFactory(login === 'JZS' ? 'JZS' : 'LHG')
  }, [User_ID])

  // const mang = ['http://192.168.32.100:8095', 'http://192.168.32.100:8083']
  const GetData = async () => {
    const url = IPserver + '/api/Statistical_All_iParking_System'
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const formattedDate = startDate.toISOString().split('T')[0]
    const obj = {
      Date: formattedDate,
      Factory: Factory
    }
    await axios
      .post(url, obj, config)
      .then((response) => {
        setTotal_Car(response.data.Total_Car)
        setTotal_Car_Unread(response.data.Total_Car_Unread)
        setTotal_Car_Read_Correct(response.data.Total_Car_Read_Correct)
        setTotal_Car_Read_Incorrect(response.data.Total_Car_Read_Incorrect)
        setTotal_Car_In(response.data.Total_Car_In)
        setTotal_Car_Out(response.data.Total_Car_Out)
        setTotal_Car_WrongRule(response.data.Total_Car_WrongRule)
        setTotal_Car_Customer(response.data.Total_Car_Customer)
        setTotal_Car_Strange(response.data.Total_Car_Strange)
        setTotal_Car_Lock(response.data.Total_Car_Lock)
      })
      .catch((error) => {
        console.error('Error in API request:', error)
        if (retryCountday < 3) {
          // Số lần thử lại tối đa
          retryCountday++
          setTimeout(GetData, retryDelay)
        } else {
          console.error('Max retry count reached. Unable to complete the request.')
        }
      })
      .finally(() => {})
  }

  const handleLogin = () => {
    setTimeout(() => {
      setCheckLogin(true)
    }, 6000)
  }
  const getStartDateLabel = (date: any) => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'TODAY'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'YESTERDAY'
    } else {
      return format(date, 'dd/MM/yyyy')
    }
  }
  const GetDataWeek = async () => {
    const url = IPserver + '/api/Statistical_All_iParking_System_Week'
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const formattedDate = startDate.toISOString().split('T')[0]
    const obj = {
      Date: formattedDate,
      days: '-6',
      Factory: Factory
    }
    await axios
      .post(url, obj, config)
      .then((response) => {
        setTotal_Car_Week(response.data)
      })
      .catch((error) => {
        console.error('Error in API request:', error)
        if (retryCountweek < 3) {
          // Số lần thử lại tối đa
          retryCountweek++
          setTimeout(GetDataWeek, retryDelay)
        } else {
          console.error('Max retry count reached. Unable to complete the request.')
        }
      })
      .finally(() => {})
  }
  const GetDataMonth = async () => {
    const url = IPserver + '/api/Statistical_All_iParking_System_Week'
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const currentDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
    const dateht = currentDate.toISOString().split('T')[0]
    const obj = {
      Date: dateht,
      days: '-30',
      Factory: Factory
    }
    await axios
      .post(url, obj, config)
      .then((response) => {
        setTotal_Car_Month(response.data)
        // console.log(response.data)
      })
      .catch((error) => {
        console.error('Error in API request:', error)
        if (retryCountmonth < 3) {
          // Số lần thử lại tối đa
          retryCountmonth++
          setTimeout(GetDataMonth, retryDelay)
        } else {
          console.error('Max retry count reached. Unable to complete the request.')
        }
      })
      .finally(() => {})
  }

  const GetDataMachine = async () => {
    const url = IPserver + '/api/Statistical_Average_Machines'
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const formattedDate = startDate.toISOString().split('T')[0]
    const obj = {
      Date: formattedDate,
      Factory: Factory
    }
    await axios
      .post(url, obj, config)
      .then((response) => {
        setTBMachine(response.data)
      })
      .catch((error) => {
        console.error('Error in API request:', error)
        if (retryCountMachine < 3) {
          // Số lần thử lại tối đa
          retryCountMachine++
          setTimeout(GetDataMachine, retryDelay)
        } else {
          console.error('Max retry count reached. Unable to complete the request.')
        }
      })
      .finally(() => {})
  }

  // useEffect(() => {

  // },[checkLogin]);

  useEffect(() => {
    // console.log(IPserver)
    const fetchData = () => {
      GetData()
      GetDataWeek()
      GetDataMachine()
      // GetDataMonth();
    }

    // Execute fetchData immediately if startDate is not today
    if (startDate.toDateString() !== new Date().toDateString()) {
      fetchData()
    }
    fetchData()
    GetDataMonth()

    const intervalId = setInterval(() => {
      // Only fetch data if startDate is today
      if (startDate.toDateString() === new Date().toDateString()) {
        fetchData()
      }
    }, 10000)

    // console.log(startDate);

    return () => clearInterval(intervalId)
  }, [startDate, Factory])

  const CustomTooltip = ({ active, payload }: any) => {
    console.log(payload)
    if (active && payload && payload.length) {
      return (
        <div className='custom-tooltip' style={{ backgroundColor: 'rgba(0, 0, 0, 0.603)' }}>
          <p className='intro'>{`${payload[0].payload.name}`}</p>
          {/* <p className='label' style={{ color: `${payload[0].fill}` }}>{`${payload[0].name} : ${payload[0].value}`}</p> */}
          <p className='label' style={{ color: `${payload[0].fill}` }}>{`${payload[0].name} : ${payload[0].value}`}</p>
          <p className='label' style={{ color: `${payload[1].fill}` }}>{`${payload[1].name} : ${payload[1].value}`}</p>
          <p className='label' style={{ color: `${payload[2].fill}` }}>{`${payload[2].name} : ${payload[2].value}`}</p>
          {/* <p className='label' style={{ color: `${payload[3].fill}` }}>{`${payload[3].name} : ${payload[3].value}`}</p> */}

          {/* <p className="intro"></p>
          <p className="desc">Anything you want can be displayed here.</p> */}
        </div>
      )
    }

    return null
  }

  const datamonth = Total_Car_Month.sort((a:any, b:any) => {
    // Assuming 'Thu' is a date string in the format "YYYY-MM-DD"
    const dateA:any  = new Date(a.Ngay);
    const dateB:any = new Date(b.Ngay);
    return dateA - dateB;
}).map(
    (item: { Ngay: string; Chinh_Xac: string; K_Chinh_Xac: string; K_Doc_Duoc: string }) => ({
      name: item.Ngay,
      CORRECT: parseInt(item.Chinh_Xac),
      INCORRECT: parseInt(item.K_Chinh_Xac),
      UNREADABLE: parseInt(item.K_Doc_Duoc)
    })
  )

  const data = Total_Car_Week.sort((a:any, b:any) => {
    // Assuming 'Thu' is a date string in the format "YYYY-MM-DD"
    const dateA:any  = new Date(a.Ngay);
    const dateB:any = new Date(b.Ngay);
    return dateA - dateB;
}).map(
    (item: { Thu: string;Ngay: string; Chinh_Xac: string; K_Chinh_Xac: string; K_Doc_Duoc: string }) => ({
      name: item.Thu,
      DATE: item.Ngay,
      CORRECT: parseInt(item.Chinh_Xac),
      INCORRECT: parseInt(item.K_Chinh_Xac),
      UNREADABLE: parseInt(item.K_Doc_Duoc)
    })
);



  const handlelogout = () => {
    const isConfirmed = window.confirm('Are you sure you want to log out?')
    if (isConfirmed) {
      localStorage.removeItem('Login')
      setCheckLogin(false)
    }
  }
  const CalendarContainer = ({ children }: any) => {
    const el = document.getElementById('calendar-portal')

    return <Portal container={el}>{children}</Portal>
  }

  if (checkLogin) {
    return (
      <div className='dasboard'>
        <div className='cuatrai'></div>
        <div className='grid grid-rows-2  md:grid-rows-1 lg:grid-rows-1 grid-flow-col  justify-center gap-0 '>
          <div className='title   '>
            <button className='btn' onClick={handlelogout}>
              DASHBROAD IPARKING{' '}
            </button>
            <select className=' ' value={Factory} onChange={(e: any) => setFactory(e.target.value)}>
              <option value={'LHG'}>LHG</option>
              <option value={'JZS'}>JZS</option>
            </select>
          </div>
          <div className='title p-0 m-0 '>
            <DatePicker
              selected={startDate}
              minDate={duoi30}
              dateFormat='dd/MM/yyyy'
              startDate={new Date()}
              maxDate={new Date()}
              onChange={(date: any) => {
                setStartDate(date)
              }}
              popperPlacement='top-start'
              placeholderText='Choose a start date'
              popperContainer={CalendarContainer}
            />
          </div>
        </div>
        {/* card thông số */}
        <div className='grid grid-rows-3 mt-12  md:grid-rows-2 lg:grid-rows-1 grid-flow-col  gap-5'>
          <div className='ring'>
            {Total_Car}
            <div className='namecardcircle'> Total</div>
          </div>
          <div className='ring'>
            {Total_Car_In}
            <div className='namecardcircle'>In</div>
          </div>
          <div className='ring'>
            {Total_Car_Out}
            <div className='namecardcircle'>Out</div>
          </div>
          <div className='ring'>
            {Total_Car_Customer}

            {/* <div className={namecardcircle1}>{Total_Car_Read_Correct}/{Total_Car_Read_Incorrect}</div> */}
            <div className='namecardcircle'>GUEST</div>
          </div>
          <div className='ring'>
            {Total_Car_Strange}
            <div className='namecardcircle'>UNKNOW</div>
          </div>
          <div className='ring'>
            {Total_Car_WrongRule}
            <div className='namecardcircle'>W-RULE</div>
          </div>
          <div className='ring'>
            {Total_Car_Lock}
            <div className='namecardcircle'>LOCK</div>
          </div>
        </div>

        {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4   mt-12 gap-5 text-center bieudo'> */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3   mt-12 gap-5 text-center bieudo'>
          <div className='row_chart'>
            <div className='contentchart'>
              MONTH <br />
              <ResponsiveContainer width='100%' height='300px' aspect={6.0 / 3.255}>
                <LineChart
                  // width={460}
                  // height={300}
                  data={datamonth}
                  margin={{
                    top: 0,
                    right: 30,
                    left: 0,
                    bottom: 0
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <Line type='monotone' dataKey='CORRECT' stroke='#00FF02' dot={{ r: 1 }} activeDot={{ r: 1 }} />
                  <Line type='monotone' dataKey='INCORRECT' activeDot={{ r: 1 }} dot={{ r: 1 }} stroke='#FDF5E6' />
                  <Line type='monotone' dataKey='UNREADABLE' activeDot={{ r: 1 }} dot={{ r: 1 }} stroke='#FF4500' />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='row_chart'>
            <div className='contentchart'>
              WEEK <br />
              <ResponsiveContainer width='100%' height='300px' aspect={6.0 / 3.255}>
                <BarChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 0
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip content={CustomTooltip} />
                  <Legend />
                  <Bar dataKey='CORRECT' stackId='a' fill='#00FF02' />
                  <Bar dataKey='INCORRECT' stackId='a' fill='#FDF5E6' />
                  <Bar dataKey='UNREADABLE' fill='#FF4500' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='row_chart'>
            <div className='contentchart'>
              {getStartDateLabel(startDate)} <br />
              <ResponsiveContainer width='100%' height='300px' aspect={6.0 / 3.455}>
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data2}
                    // cx={190}
                    // cy={110}
                    innerRadius={30}
                    outerRadius={60}
                    fill='#fff000'
                    dataKey='value'
                    // onMouseEnter={onPieEnter}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* <div className='row_chart'>
            <div className='contentchart'>
              <ResponsiveContainer width='100%' height='300px' aspect={6.0 / 3.255}>
                <ComposedChart
                  width={700}
                  height={400}
                  data={datak}
                  margin={{
                    top: 20,
                    right: 80,
                    bottom: 20,
                    left: 20
                  }}
                >
                  <CartesianGrid stroke='#f5f5f5' />
                  <XAxis
                    dataKey='name'
                    label={{ value: 'Pages', position: 'insideBottomRight', offset: 0 }}
                    scale='band'
                  />
                  <YAxis label={{ value: 'Index', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Area type='monotone' dataKey='amt' fill='#8884d8' stroke='#8884d8' />

                  <Bar dataKey='amt' barSize={20} fill='#413ea0' />
                  <Bar dataKey='pv' barSize={20} fill='#413ea0' />
                  <Line type='monotone' dataKey='uv' stroke='#ff7300' />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div> */}
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 mt-10 gap-3 px-5 text-center'>
          {TBMachine.map((item: any, index: number) => {
            if (item.MAIN != '10' && item.MAIN != '9' && item.MAIN != '123') {
              return (
                <div key={index} className='cardMachine'>
                  <div className='cardName '>M{item.MAIN}</div>
                  <div className='cardContent'>
                    {item.TBIN} <br /> {item.TBOUT}
                  </div>
                </div>
              )
            }
          })}
          {/*  <div className='cardMachine'>
            <div className='cardName'>{TBMachine[0]?.MAIN !=='' ? 'M' + TBMachine[0]?.MAIN : 'M0'}</div>

            <div className='cardContent'>
              <p>{TBMachine ? TBMachine[0]?.TBIN : ''}</p>
              <p>{TBMachine ? TBMachine[0]?.TBOUT : ''}</p>
            </div>
          </div>
          <div className='cardMachine'>
            <div className='cardName'>{TBMachine[1]?.MAIN   ? 'M' + TBMachine[1]?.MAIN : ''}</div>
            <div className='cardContent'>
              <p>{TBMachine ? TBMachine[1]?.TBIN : ''}</p>
              <p>{TBMachine ? TBMachine[1]?.TBOUT : ''}</p>
            </div>
          </div>
          <div className='cardMachine'>
            <div className='cardName'>{TBMachine[2]?.MAIN   ? 'M' + TBMachine[2]?.MAIN : ''}</div>
            <div className='cardContent'>
              <p>{TBMachine ? TBMachine[2]?.TBIN : ''}</p>
              <p>{TBMachine ? TBMachine[2]?.TBOUT : ''}</p>
            </div>
          </div>
          <div className='cardMachine'>
            <div className='cardName'>{TBMachine[3]?.MAIN   ? 'M' + TBMachine[3]?.MAIN : ''}</div>
            <div className='cardContent'>
              <p>{TBMachine ? TBMachine[3]?.TBIN : ''}</p>
              <p>{TBMachine ? TBMachine[3]?.TBOUT : ''}</p>
            </div>
          </div>
          <div className='cardMachine'>
            <div className='cardName'>{TBMachine[4]?.MAIN   ? 'M' + TBMachine[4]?.MAIN : ''}</div>
            <div className='cardContent'>
              <p>{TBMachine ? TBMachine[4]?.TBIN : ''}</p>
              <p>{TBMachine ? TBMachine[4]?.TBOUT : ''}</p>
            </div>
          </div>
          <div className='cardMachine'>
            <div className='cardName'>{TBMachine[5]?.MAIN   ? 'M' + TBMachine[5]?.MAIN : ''}</div>
            <div className='cardContent'>
              <p>{TBMachine ? TBMachine[5]?.TBIN : ''}</p>
              <p>{TBMachine ? TBMachine[5]?.TBOUT : ''}</p>
            </div>
          </div>
          <div className='cardMachine'>
            <div className='cardName'>{TBMachine[6]?.MAIN   ? 'M' + TBMachine[6]?.MAIN : ''}</div>
            <div className='cardContent'>
              <p>{TBMachine ? TBMachine[6]?.TBIN : ''}</p>
              <p>{TBMachine ? TBMachine[6]?.TBOUT : ''}</p>
            </div>
          </div>
          <div className='cardMachine'>
            <div className='cardName'>{TBMachine[7]?.MAIN   ? 'M' + TBMachine[7]?.MAIN : ''}</div>
            <div className='cardContent'>
              <p>{TBMachine ? TBMachine[7]?.TBIN : ''}</p>
              <p>{TBMachine ? TBMachine[7]?.TBOUT : ''}</p>
            </div>
          </div>


          */}
        </div>

        <div className='cuaphai'></div>
      </div>
    )
  }
  return <Login onLogin={handleLogin}></Login>
}

export default App
