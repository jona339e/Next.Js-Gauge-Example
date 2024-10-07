import { InfluxDB } from '@influxdata/influxdb-client';

const token = '1THzWhMbwyhAnoem-CGF0AfxAn8iWXjQxsNEj4aViAoDOkz9jywMJyLHQzDxzPcddBO0ITgk_Vld2zdZsN1ZaQ=='
const org = 'TecEnergy';
const bucket = 'Energy_Collection';
const url = 'http://10.233.134.124:8086';

const queryAPI = new InfluxDB({ url, token }).getQueryApi(org);

export async function fetchMeasurements(submeterGuid: string) {

    const fluxQuery = `
    from(bucket: "${bucket}")
        |> range(start: -10s)
        |> filter(fn: (r) => r["_measurement"] == "Energy_Measurement")
        |> filter(fn: (r) => r["_field"] == "accumulated_value")
        |> filter(fn: (r) => r["submeter"] == "${submeterGuid}")
        |> count()
        |> map(fn: (r) => ({
            r with
            _value: (3600.0 / (10.0 / float(v: r._value))) / 1000.0
        })
        )
        |> set(key: "_field", value: "gauge_value")
        |> keep(columns: ["_time", "_value", "gauge_value"])
        |> yield(name: "gauge_value")
    `;

    try {

    const results: any = [];

    return new Promise((resolve, reject) => {

        queryAPI.queryRows(fluxQuery, {
            next(row, tableMeta) {
                const data = tableMeta.toObject(row);
                results.push(data);

            },
            error(error) {
                console.error(error);
                reject('Error fetching data');

            },
            complete() {
                resolve(results);

            },
        });

    });

    } catch (error) {
        console.error('InfluxDB fetch error:', error);
        throw new Error('Failed to fetch data from InfluxDB');
    }
    
}