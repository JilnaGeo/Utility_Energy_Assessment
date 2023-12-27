const AWS = require('aws-sdk')

const peakHrRate = 'tobedecided'
const offPeakHrRate = 'yettodecide';

exports.handler = async (event) => {
    try {

        if (!event || !event.body) {
            throw new Error('Event is undefined')
        }
        const meterData = event.body;
        const { meter_id, timestamp, meter_reading } = JSON.parse(meterData);
        if (!meter_id || !timestamp || isNaN(meter_reading) < 0) {
            throw new Error('Invalid input data');
        }
        const hour = new Date(timestamp).getHours();



    }
    catch (error) {

    }
}
