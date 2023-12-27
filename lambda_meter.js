const aws = require('aws-sdk')
const sns = new aws.sns();

exports.handler = async (event) => {
    try {
        if (!event || !event.body) {
            throw new Error('Event is undefined')
        }
        const meterData = event.body;
        //NOTE---> assuming peak rate and off-peak rate is provided with the input
        //if peak rate and off-peak rate are not provided,can pass in the rates as a variable before the if block starts
        const { meter_id, timestamp, meter_reading, peakHrRate, offPeakHrRate } = JSON.parse(meterData);
        if (!meter_id || !timestamp || isNaN(meter_reading) || meter_reading < 0) {
            throw new Error('Invalid meter data');
        }
        //extracting hour from the timestamp
        const hour = new Date(timestamp).getHours();

        //determining the rate depending on the hour -> checks whether the hour is a peak hour or not
        const rate = (hour >= 7 && hour < 24) ? peakHrRate : offPeakHrRate;

        //calculating cost depending on the rate and meter reading
        const cost = meter_reading * rate;
        const response = {
            meter_id: meter_id,
            timestamp: timestamp,
            cost: cost
        };
        const dummyArn = 'arn:aws:sns:us-east-1:xxxxx' //to be replaced by actual sns topic
        //sending response to topic
        await sns.publish({
            TopicArn: dummyArn,
            Message: JSON.stringify(response)
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    }
    //error handling
    catch (error) {
        console.error('Some error occured while processing meter data', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server Error',
                message: error.message
            })
        }
    };
};
