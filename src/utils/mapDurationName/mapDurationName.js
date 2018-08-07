
/**
 * 
 */
const mapDurationName = (durationName) => {
    let mappedDurationName = null

    if (durationName) {
        const normalizedDurationName = durationName.toLowerCase()

        switch (normalizedDurationName) {
            case 'ms':
            case 'millisecond':
            case 'milliseconds':
                mappedDurationName = 'ms'
                break;
            case 'sec':
            case 'second':
            case 'seconds':
                mappedDurationName = 's'
                break;
            case 'min':
            case 'minute':
            case 'minutes':
                mappedDurationName = 'm'
                break;
            case 'hr':
            case 'hora':
            case 'horas':
            case 'hour':
            case 'hours':
                mappedDurationName = 'h'
                break;
            case 'd':
            case 'day':
            case 'days':
                mappedDurationName = 'd'
                break;
            case 'wk':
            case 'week':
            case 'weeks':
                mappedDurationName = 'w'
                break;
        }
    }

    return mappedDurationName
}

export default mapDurationName