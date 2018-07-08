export const calcBalance = (money, schedules, history) => {
    let balance = money

    history.betting.forEach(betting => {
        const { result } = schedules.find(s => s.id === betting.scheduleId)
        const notFinish = result == null
        const win = result === betting.result

        if (notFinish) {
            balance -= betting.money
        } else if (win) {
            balance += parseInt(betting.money * betting.odds, 10)
        } else {
            balance -= betting.money
        }
    })

    history.checkin.forEach(checkin => balance += checkin.money)
    return balance
}

export const calcWinCount = (schedules, history) => {
    return history.betting.filter(betting => {
        const { result } = schedules.find(s => s.id === betting.scheduleId)
        return result === betting.result
    }).length
}