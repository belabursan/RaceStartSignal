


function Enum(baseEnum) {
    return new Proxy(baseEnum, {
        get(target, name) {
            if (!baseEnum.hasOwnProperty(name)) {
                throw new Error(`"${name}" value does not exist in the enum`)
            }
            return baseEnum[name]
        },
        set(target, name, value) {
            throw new Error('Cannot add a new value to the enum')
        }
    })
}


/**
 * Enum for race status
 */
const RACE_STATUS = Enum({
    DNC: 'DNC', // Did not start; did not come to the starting area
    DNS: 'DNS', // Did not start (other than DNC and OCS)
    OCS: 'OCS', // Did not start; on the course side of the starting line at her starting signal and failed to start, or broke rule 30.1 
    ZFP: 'ZFP', // 20% penalty under rule 30.2
    UFD: 'UFD', // Disqualification under rule 30.3
    BFD: 'BFD', // Disqualification under rule 30.4
    SCP: 'SCP', // Scoring Penalty applied
    NSC: 'NSC', // Did not sail the course
    DNF: 'DNF', // Did not finish
    RET: 'RET', // Retired
    RAF: 'RAF', // Retired after finishing
    DSQ: 'DSQ', // Disqualification
    DNE: 'DNE', // Disqualification that is not excludable
    DGM: 'DGM', //
    RDG: 'RDG', // Redress given
    RCG: 'RCG', //
    DPI: 'DPI', // Discretionary penalty imposed
    SNF: 'SNF', // Started, not finished (yet), THIS IS OUR SPECIAL CODE !!!!!!!
    SAF: 'SAF', // Started and finished (in time), THIS IS OUR SPECIAL CODE !!!!!
    JOI: 'JOI'  // Joined , THIS IS OUR SPECIAL CODE !!!!!!!
});

/**
 * Enum for the user roles
 */
const ROLE = Enum({
    USER: "USER",
    ADMIN: "ADMIN",
    SYSADMIN: "SYSADMIN"
});


/**
 * Enum for SRS types
 */
const SRS_TYPE = Enum({
    SRS_DEFAULT: 'SRS_DEFAULT',
    SRS_NO_SPINNAKER: 'SRS_NO_SPINNAKER',
    SRS_SHORTHAND: 'SRS_SHORTHAND',
    SRS_SHORTHAND_NO_SPINNAKER: 'SRS_SHORTHAND_NO_SPINNAKER'
});


/**
 * Enum for race types
 */
const RACE_TYPE = Enum({
    RACE_TYPE_5_4_1_0: '5-4-1-0',
    RACE_TYPE_10_9_1_0: '10-9-1-0'
});


/**
 * Enum for race status
 */
const STATUS = Enum({
    CREATED: 'CREATED',
    JOINABLE: 'JOINABLE',
    COURSE_SET: 'COURSE_SET',
    FIVE_MIN: 'FIVE_MIN',
    FOUR_MIN: 'FOUR_MIN',
    ONE_MIN: 'ONE_MIN',
    STARTED: 'STARTED',
    ABORTED: 'ABORTED',
    FINISHED: 'FINISHED'
});


module.exports = {
    RACE_STATUS,
    ROLE,
    SRS_TYPE,
    RACE_TYPE,
    STATUS
}
