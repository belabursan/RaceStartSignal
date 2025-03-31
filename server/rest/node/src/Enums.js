


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
 * Enum for signal types
 */
const SIGNAL_TYPE = Enum({
    //StartSignal(short), OneMinSignal(long), FourMinSignal(short) or FiveMinSignal(short)
    StartSignal: 0,
    OneMinSignal: 2,
    FourMinSignal: 4,
    FiveMinSignal: 5,
    None: -1
});


module.exports = {
    SIGNAL_TYPE
}
