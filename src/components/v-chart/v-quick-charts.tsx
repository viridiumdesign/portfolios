
import {
    Chart as ChartJS, ArcElement, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title, Tooltip, Legend
} from 'chart.js';
import { Component } from 'react';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend);

type ChartProps = {
    options:any;
    data:any
}

type ChartState = {
    
}

export class QuickLine extends Component<ChartProps, ChartState> {
    getOptions = () => {
        return this.props.options;
    }
    getData = () => {
        return this.props.data;
    }
    render = () => {
        return <Line options={this.getOptions()} data={this.getData()} />
    }
}

export class QuickPie extends Component<ChartProps, ChartState> {
    getOptions = () => {
        return this.props.options;
    }
    getData = () => {
        return this.props.data;
    }
    render = () => {
        return <Pie options={this.getOptions()} data={this.getData()} />
    }
}