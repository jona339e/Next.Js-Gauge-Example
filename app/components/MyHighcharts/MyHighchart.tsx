'use client'
import React from 'react'
import * as Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge.js";
import { useEffect, useState } from 'react';
import styles from './MyHighchart.module.css'

highchartsMore(Highcharts);
solidGauge(Highcharts);


const MyHighchart = () => {

    const [backgroundColor, setBackgroundColor] = useState('');
    const [foregroundColor, setForegroundColor] = useState('');

    useEffect(() => {
        // Only run after component mounts
        const bg = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff';
        const fg = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#000000';

        setBackgroundColor(bg);
        setForegroundColor(fg);
    }, []); // Empty dependency array ensures this runs only once after mounting

    const options = {
        chart: {
            type: 'solidgauge',
            backgroundColor: backgroundColor,
        },
    
        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: foregroundColor,
                borderRadius: 5,
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            },
            zIndex: 0
        },
    
        exporting: {
            enabled: false
        },
    
        tooltip: {
            enabled: false
        },
    
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.8, '#DF5353'] // red
            ],
            minorTickInterval: .5,
            tickWidth: 2,
            tickLength: 15,
            minorTickColor: backgroundColor,
            min: 0,
            max: 20,
            title: {
                text: 'Energy',
                style: {
                    color: foregroundColor
                }
            },
            labels: {
                style:{
                    color: backgroundColor

                },
                formatter: function(this: Highcharts.AxisLabelsFormatterContextObject) {
                    // Hide the first and last label (min and max values)
                    if (this.value === this.axis.min || this.value === this.axis.max) {
                        return null; // Return null to hide the label
                    }
                    return this.value; // Return the value for other labels
                }
            },
            zIndex: 10
        },

        series: [{
            name: 'kWh',
            data: [5],
            dataLabels: {
                format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y:.1f}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">' +
                'kWh' +
                '</span>' +
                '</div>'
            },
            tooltip: {
                valueSuffix: 'kWh'
            }
        }],
    
        plotOptions: {
            solidgauge: {
                borderRadius: 3,
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        },

        credits:{
            enabled: false
        },


    };



  return (
    <div>
        <div className={styles.background} >

        </div>
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    </div>
  )
}

export default MyHighchart