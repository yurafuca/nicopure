class Time
{
    constructor() {
        // do nothing.
    }

    static jpStr(time) {
        const date = new Date(time * 1000);
        let y  = date.getFullYear();
        let mo = date.getMonth();
        let d  = date.getDate();
        let da = date.getDay();
        let h  = date.getHours();
        let mi = date.getMinutes();

        da = Time.dayStr(da);
        mo = Time.monthStr(mo);

        return `${d} on ${mo} ${y}`;
    }

    static monthStr(num) {
        if (num<0 || 12<num) {
            return new Error('an argument must be 0<=n<=12');
        }
        const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return names[num];
    }

    static dayStr(num) {
        if (num<0 || 7<num) {
            return new Error('an argument must be 0<=n<=7');
        }
        const names = ["Sun", "Mon", "Tue", "Wen","Thu", "Fry", "Sat"];
        return names[num];
    }
}