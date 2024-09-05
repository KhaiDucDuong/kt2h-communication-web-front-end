export function getLastSentDisplayDateTime(lastSent: Date): string{
    const now = new Date();
    const differenceInTime = Math.abs(now.getTime() - lastSent.getTime())
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24))
    // console.log("Time dif: " + differenceInTime)
    // console.log("Day dif: " + differenceInDays)
    let result = ""
    if(differenceInDays === 0){
        result = lastSent.toLocaleTimeString("vi-VN", {hour: "2-digit", minute: "2-digit"})
    } else if(differenceInDays === 1) {
        result = `yesterday`
    } else if(differenceInDays > 1 && differenceInDays <= 7) {
        result = `${differenceInDays} days`
    } else if(differenceInDays > 7 && differenceInDays < 365) {
        result = lastSent.toLocaleDateString("vi-VN", {day: "2-digit", month: "2-digit"})
    } else if(differenceInDays >= 365){
        result = lastSent.getFullYear().toString()
    }
    // console.log("Formated last sent: " + result)
    return result;
}

export function getFriendRequestSentDateTime(lastSent: number): string{
    const now = new Date();
    const differenceInTime = Math.abs(now.getTime() - lastSent)
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24))
    let result = ""
    if(differenceInDays === 0){
        result = new Date(lastSent).toLocaleTimeString("vi-VN", {hour: "2-digit", minute: "2-digit"})
    } else if(differenceInDays === 1) {
        result = `yesterday`
    } else if(differenceInDays > 1 && differenceInDays <= 7) {
        result = `${differenceInDays} days`
    } else if(differenceInDays > 7 && differenceInDays < 365) {
        result = new Date(lastSent).toLocaleDateString("vi-VN", {day: "2-digit", month: "2-digit"})
    } else if(differenceInDays >= 365){
        result = new Date(lastSent).getFullYear().toString()
    }
    return result;
}

export function getMessageSentDateTime(lastSent: number): string{
    const now = new Date();
    const differenceInTime = Math.abs(now.getTime() - lastSent)
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24))
    let result = ""
    if(differenceInDays === 0){
        result = new Date(lastSent).toLocaleTimeString("vi-VN", {hour: "2-digit", minute: "2-digit"})
    } else if(differenceInDays === 1) {
        result = `yesterday`
    } else if(differenceInDays > 1 && differenceInDays <= 7) {
        result = `${differenceInDays} days`
    } else if(differenceInDays > 7 && differenceInDays < 365) {
        result = new Date(lastSent).toLocaleDateString("vi-VN", {day: "2-digit", month: "2-digit"})
    } else if(differenceInDays >= 365){
        result = new Date(lastSent).getFullYear().toString()
    }
    return result;
}