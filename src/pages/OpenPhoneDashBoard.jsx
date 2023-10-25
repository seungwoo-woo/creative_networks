import React from 'react'
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';



const data = [{name: 'Page A', uv: 400, pv: 240, amt: 2400},
              {name: 'Page B', uv: 300, pv: 280, amt: 2400},
              {name: 'Page C', uv: 300, pv: 210, amt: 2400},
              {name: 'Page D', uv: 200, pv: 140, amt: 2400},
              {name: 'Page E', uv: 280, pv: 420, amt: 2400},
              {name: 'Page F', uv: 190, pv: 120, amt: 2400},
            ];

function OpenPhoneDashBoard(props) {

// ------------------------------------------------------------------------------------
// return 시작 ------------------------------------------------------------------------
// ------------------------------------------------------------------------------------
return (
  <>
    <ResponsiveAppBar />
    <div>OpenPhoneDashBoard</div>

    <div style={{marginTop: 50, display: 'flex', justifyContent: 'center'}}>
      <LineChart width={600} height={300} data={data} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    </div>
  </>
);

}

export default OpenPhoneDashBoard