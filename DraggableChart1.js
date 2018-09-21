import * as React from 'react';
import * as Chart from 'chart.js';
import { HorizontalBar } from 'react-chartjs-2';
import { drag } from 'd3-drag'
import { select, event } from 'd3-selection'

let element, scale, scaleX

function getElement(chartInstance, callback) {
  return () => {
    if (event) {
      const e = event.sourceEvent
      element = chartInstance.getElementAtEvent(e)[0]
      if (element) {
        scale = element['_yScale'].id
        scaleX = element['_xScale'].id
        if (typeof callback === 'function' && element) callback(e, element)
      }
    }
  }
}

function updateData(chartInstance, callback) {
  return () => {
    if (element && event) {
      const e = event.sourceEvent
      const datasetIndex = element['_datasetIndex']
      const index = element['_index']

      let x
      let y
      if (e.touches) {
        x = chartInstance.scales[scaleX].getValueForPixel(e.touches[0].clientX - chartInstance.canvas.getBoundingClientRect().left)
        y = chartInstance.scales[scale].getValueForPixel(e.touches[0].clientY - chartInstance.canvas.getBoundingClientRect().top)
      } else {
        x = chartInstance.scales[scaleX].getValueForPixel(e.clientX - chartInstance.canvas.getBoundingClientRect().left)
        y = chartInstance.scales[scale].getValueForPixel(e.clientY - chartInstance.canvas.getBoundingClientRect().top)
      }

      x = x > chartInstance.scales[scaleX].max ? chartInstance.scales[scaleX].max : x
      x = x < chartInstance.scales[scaleX].min ? chartInstance.scales[scaleX].min : x

      y = y > chartInstance.scales[scale].max ? chartInstance.scales[scale].max : x
      y = y < chartInstance.scales[scale].min ? chartInstance.scales[scale].min : x
      if (chartInstance.data.datasets[datasetIndex].data[index].x !== undefined && chartInstance.options.dragX) {
        chartInstance.data.datasets[datasetIndex].data[index].x = x
      }

      if (chartInstance.data.datasets[datasetIndex].data[index].y !== undefined) {
        chartInstance.data.datasets[datasetIndex].data[index].y = y
      }
      else {
        chartInstance.data.datasets[datasetIndex].data[index] = y
      }

      chartInstance.update(0)

      if (typeof callback === 'function') {
        callback(e, datasetIndex, index, chartInstance.data.datasets[datasetIndex].data[index])
      }
    }
  }
}

function dragEndCallback(chartInstance, callback) {
  return () => {
    if (typeof callback === 'function' && element) {
      const e = event.sourceEvent
      const datasetIndex = element['_datasetIndex']
      const index = element['_index']
      const value = chartInstance.data.datasets[datasetIndex].data[index]
      return callback(e, datasetIndex, index, value)
    }
  }
}
const ChartJSdragDataPlugin = {
  afterInit: function (chartInstance) {
    if (chartInstance.options.dragData) {
      select(chartInstance.chart.canvas).call(
        drag().container(chartInstance.chart.canvas)
          .on('start', getElement(chartInstance, chartInstance.options.onDragStart))
          .on('drag', updateData(chartInstance, chartInstance.options.onDrag))
          .on('end', dragEndCallback(chartInstance, chartInstance.options.onDragEnd))
      )
    }
  }
}

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: []
    }
  ]
};


export class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  }

  options = {
    scales: {
      xAxes: [{
        ticks: {
          display: true,
          scaleSteps: 5,
          beginAtZero: 0,
          suggestedMin: 0,
          suggestedMax: 70,
          fontColor: '#9B9B9B',
        },
        gridLines: {
          display: false,
          offsetGridLines: false,
          color: '3C3C3C',
          tickMarkLength: 5,
        },
      }
      ]
    },
    dragData: true,
    dragX: true,
    onDragStart: function (event, element) {
      // console.log("onDragStart", event, element)
    },
    onDrag: function (event, datasetIndex, index, value) {
      // console.log("onDrag", event, datasetIndex, index, value)
    },
    onDragEnd: this.onDragEnd
  }

  onDragEnd = (event, datasetIndex, index, value) => {
    const data = this.state.data;
    data[index] = value
    this.setState({ data })
  }
  componentWillMount() {
    Chart.pluginService.register(ChartJSdragDataPlugin);
  }
  render() {
    let chartData = { ...data };
    chartData.datasets[0].data = this.state.data;
    return <HorizontalBar data={chartData} options={this.options} />
  }
}

export default App;
