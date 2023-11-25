/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {  useEffect, useState } from 'react'

import './App.css'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import axios from "axios";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from 'recharts';
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
    label,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 10;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

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
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 4}
        y={ey}
        textAnchor={textAnchor}
        fill="#fff000"
      >{`${label}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1)}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#fff000"
      >
        {`(${value}%)`}
      </text>
    </g>
  );
};
interface  thongkexe {
  Thu: string; 
  Ngay: string; 
  Chinh_Xac: string; 
  K_Chinh_Xac: string; 
  K_Doc_Duoc: string;

 
}
function App() {
  const [activeIndex] = useState([0, 1, 2, 3]);
  const [Total_Car, setTotal_Car] = useState(0);
  // const [Total_Car_Read, setTotal_Car_Read] = useState(0);
  const [Total_Car_Unread, setTotal_Car_Unread] = useState(0);
  const [Total_Car_Read_Correct, setTotal_Car_Read_Correct] = useState(0);
  const [Total_Car_Read_Incorrect, setTotal_Car_Read_Incorrect] = useState(0);
  const [Total_Car_In, setTotal_Car_In] = useState(0);
  const [Total_Car_Out, setTotal_Car_Out] = useState(0);
  const [Total_Car_WrongRule, setTotal_Car_WrongRule] = useState(0);
  const [Total_Car_Customer, setTotal_Car_Customer] = useState(0);
  const [Total_Car_Strange, setTotal_Car_Strange] = useState(0);
  const [Total_Car_Lock, setTotal_Car_Lock] = useState(0);
  const [Total_Car_Week, setTotal_Car_Week] = useState<thongkexe[]>([]);
  const [Total_Car_Month, setTotal_Car_Month] = useState<thongkexe[]>([]);
  const duoi30 = new Date();
  duoi30.setDate(duoi30.getDate() - 29);
  const [startDate, setStartDate] = useState(new Date(new Date().getTime() - 24 * 60 * 60 * 1000));

  // const data2 = [
  //   // { name: "OK", value: Total_Car_Read_Percent, label: "READABLE", color: "#FF4500"  },
  //   {
  //     name: "OK",
  //     value: parseFloat(((Total_Car_Unread / (Total_Car_Read + Total_Car_Unread)) * 100).toFixed(2)),
  //     label: "UNREADABLE",
  //     color: "#FF4500",
  //   },
  //   {
  //     name: "OK",
  //     value: parseFloat(
  //       ((Total_Car_Read_Correct / Total_Car_Read ) * 100).toFixed(2)
  //       ),
  //     label: "CORRECT",
  //     color: "#00FF02",
  //   },
  //   {
  //     name: "OK",
  //     value: parseFloat(
  //       ((Total_Car_Read_Incorrect / Total_Car_Read ) * 100).toFixed(2)
  //     ),
  //     label: "INCORRECT",
  //     color: "#FDF5E6",
  //   },
  // ];
  const data2 = [
    // { name: "OK", value: Total_Car_Read_Percent, label: "READABLE", color: "#FF4500"  },
    {
      name: "OK",
      value: parseFloat(((Total_Car_Unread / ( Total_Car_Unread+Total_Car_Read_Correct+Total_Car_Read_Incorrect)) * 100).toFixed(2)),
      label: "UNREADABLE",
      color: "#FF4500",
    },
    {
      name: "OK",
      value: parseFloat(
        ((Total_Car_Read_Correct / ( Total_Car_Unread+Total_Car_Read_Correct+Total_Car_Read_Incorrect) ) * 100).toFixed(2)
        ),
      label: "CORRECT",
      color: "#00FF02",
    },
    {
      name: "OK",
      value: parseFloat(
        ((Total_Car_Read_Incorrect / ( Total_Car_Unread+Total_Car_Read_Correct+Total_Car_Read_Incorrect) ) * 100).toFixed(2)
      ),
      label: "INCORRECT",
      color: "#FDF5E6",
    },
  ];

  
  const GetData = async () => {
    const url = "http://192.168.32.65:6969/api/Statistical_All_iParking_System";
    const config = {
      headers: {
  
        "Content-Type": "application/json"
        
      },
    };
    const formattedDate = startDate.toISOString().split('T')[0];
    const obj = {
      Date: formattedDate,
    };
    await axios
      .post(url, obj, config)
      .then((response) => {
        setTotal_Car(response.data.Total_Car);
        setTotal_Car_Unread(response.data.Total_Car_Unread);
        // setTotal_Car_Read(response.data.Total_Car_Read);
        setTotal_Car_Read_Correct(response.data.Total_Car_Read_Correct);
        setTotal_Car_Read_Incorrect(response.data.Total_Car_Read_Incorrect);
        setTotal_Car_In(response.data.Total_Car_In);
        setTotal_Car_Out(response.data.Total_Car_Out);
        setTotal_Car_WrongRule(response.data.Total_Car_WrongRule);
        setTotal_Car_Customer(response.data.Total_Car_Customer);
        setTotal_Car_Strange(response.data.Total_Car_Strange);
        setTotal_Car_Lock(response.data.Total_Car_Lock);
      })
      .finally(() => {});
  };


  const getStartDateLabel = (date:any) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "TODAY";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "YESTERDAY";
    } else {
      return format(date, "dd/MM/yyyy");
    }
  };
  const GetDataWeek = async () => {
    const url = "http://192.168.32.65:6969/api/Statistical_All_iParking_System_Week";
    const config = {
      headers: {
       
        "Content-Type": "application/json",
      },
    };


    const formattedDate = startDate.toISOString().split('T')[0];
    const obj = {
      Date: formattedDate,
      days:"-6"
    };
    await axios
      .post(url, obj, config)
      .then((response) => {
        setTotal_Car_Week(response.data)
        // console.log(response.data)
      })
      .finally(() => {});
  };
  const GetDataMonth = async () => {
    const url = "http://192.168.32.65:6969/api/Statistical_All_iParking_System_Week";
    const config = {
      headers: {
      
        "Content-Type": "application/json",
      },
    };

  const   currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const dateht = currentDate.toISOString().split('T')[0];
    const obj = {
      Date: dateht,
      days:"-30"
    };
    await axios
      .post(url, obj, config)
      .then((response) => {
        setTotal_Car_Month(response.data)
        // console.log(response.data)
      })
      .finally(() => {});
  };
 
  useEffect(() => {
    GetData();
    GetDataWeek();
    GetDataMonth();
    // const intervalId = setInterval(() => {
    //   GetData();
    //   GetDataWeek();
    //   GetDataMonth();
    // }, 230000000);

    // return () => clearInterval(intervalId);
    console.log(startDate)
  }, [startDate]);

  useEffect(() => {

    GetDataMonth();
    const intervalId = setInterval(() => {
    
      GetDataMonth();
    }, 230000000);

    return () => clearInterval(intervalId);
  }, []);
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (

        <div className="custom-tooltip" style={{backgroundColor:"rgba(0, 0, 0, 0.603)"}}>
           <p className="intro">{`${payload[0].payload.name}`}</p>
          <p className="label" style={{ color:`${payload[0].fill}`}}>{`${payload[0].name} : ${payload[0].value}`}</p>
          <p className="label" style={{ color:`${payload[1].fill}`}}>{`${payload[1].name} : ${payload[1].value}`}</p>
          <p className="label" style={{ color:`${payload[2].fill}`}}>{`${payload[2].name} : ${payload[2].value}`}</p>
          
          {/* <p className="intro"></p>
          <p className="desc">Anything you want can be displayed here.</p> */}
        </div>
      );
    }
  
    return null;
  };


  const datamonth = Total_Car_Month.map((item: { Ngay: string; Chinh_Xac: string; K_Chinh_Xac: string; K_Doc_Duoc: string; }) => ({
    name: item.Ngay,
    CORRECT: parseInt(item.Chinh_Xac),
    INCORRECT:parseInt(item.K_Chinh_Xac),
    UNREADABLE:parseInt(item.K_Doc_Duoc),
  }));

  const data= Total_Car_Week.map((item: { Thu: string; Chinh_Xac: string; K_Chinh_Xac: string; K_Doc_Duoc: string; }) => ({
    name: item.Thu,
    CORRECT: parseInt(item.Chinh_Xac),
    INCORRECT:parseInt(item.K_Chinh_Xac),
    UNREADABLE:parseInt(item.K_Doc_Duoc),
  }));

  return (
    <>
     <div className="title">DASHBROAD IPARKING <DatePicker selected={startDate} minDate={duoi30}     dateFormat="dd/MM/yyyy" startDate={new Date()} maxDate={new Date()} onChange={(date:any) => {setStartDate(date)}} /></div>
      {/* card thông số */}
      <div className="grid grid-rows-3  md:grid-rows-2 lg:grid-rows-1 grid-flow-col  gap-5">
        <div className="ring">
          {Total_Car}
          <div className="namecardcircle"> Total</div>
        </div>
        <div className="ring">
          {Total_Car_In}<div className="namecardcircle">In</div>
        </div>
        <div className="ring">
          {Total_Car_Out}<div className="namecardcircle">Out</div>
        </div>
        <div className="ring">
          {Total_Car_Customer}

          {/* <div className={namecardcircle1}>{Total_Car_Read_Correct}/{Total_Car_Read_Incorrect}</div> */}
          <div className="namecardcircle">GUEST</div>
        </div>
        <div className="ring">
          {Total_Car_Strange}
          <div className="namecardcircle">UNKNOW</div>
        </div>
        <div className="ring">
          {Total_Car_WrongRule}
          <div className="namecardcircle">W-RULE</div>
        </div>
        <div className="ring">
          {Total_Car_Lock}
          <div className="namecardcircle">LOCK</div>
        </div>
      </div>

      <div className="grid grid-rows-3 md:grid-rows-2 lg:grid-rows-1  grid-flow-col mt-12 gap-5 text-center">
        <div className="row_chart">

     
    
          <div className="contentchart">
          MONTH <br />
          <ResponsiveContainer width='100%' height='300px' aspect={6.0/3.255}>
            <LineChart
              // width={460}
              // height={300}
              data={datamonth}
              margin={{
                top: 0,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={CustomTooltip}/>
              <Legend />
              <Line
                type="monotone"
                dataKey="CORRECT"
                stroke="#00FF02"
                dot={{ r:1}}
                activeDot={{ r: 1 }}
              />
              <Line type="monotone" dataKey="INCORRECT"
              activeDot={{ r: 1 }}
              dot={{ r:1}}
               stroke="#FDF5E6" />
              <Line type="monotone" dataKey="UNREADABLE"
              activeDot={{ r: 1 }}
              dot={{ r:1}}
               stroke="#FF4500" />
            </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="row_chart">
          <div className="contentchart">
          WEEK <br />
          <ResponsiveContainer width='100%' height='300px'  aspect={6.0/3.255}>
            <BarChart 
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={CustomTooltip} />
              <Legend />
              <Bar dataKey="CORRECT" stackId="a" fill="#00FF02" />
              <Bar dataKey="INCORRECT" stackId="a" fill="#FDF5E6" />
              <Bar dataKey="UNREADABLE" fill="#FF4500" />
            </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="row_chart">
          <div className="contentchart">
          { getStartDateLabel(startDate) } <br />
          <ResponsiveContainer width='100%' height='300px' aspect={6.0/3.455}>
            <PieChart >
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data2}
                // cx={190}
                // cy={110}
                innerRadius={30}
                outerRadius={60}
                fill="#fff000"
                dataKey="value"
                // onMouseEnter={onPieEnter}
              />
            </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


    </>
  )
}

export default App
