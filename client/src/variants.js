export const fadeIn = (direction, delay) => {
    return{
        hidden: {
            y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
            x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
            opacity:0.4
        },
        show: {
            y:0,
            x:0,
            opacity:1,
            transition: {
                type: 'tween',
                duration: 2,
                delay: delay,
                ease: [0.25, 0.25, 0.25, 0.75]
            }
        }
    }
}

export const fadeIn2 = (direction, delay) => {
    return{
        hidden: {
            y: direction === 'up' ? 80 : direction === 'down' ? -80 : 0,
            x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
            opacity:0.4
        },
        show: {
            y:0,
            x:0,
            opacity:1,
            transition: {
                type: 'tween',
                duration: 2,
                delay: delay,
                ease: [0.25, 0.25, 0.25, 0.75]
            }
        }
    }
}