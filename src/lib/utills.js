// import { MAIN_URL } from "../config";

export default {
    convertTime: (d) => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localTime = d.toLocaleString('en-US', { timeZone: timezone });
        const newDate = new Date(localTime);
        return newDate.getHours() + ':' + newDate.getMinutes();
    },

    urlString: (url) => {
        if (typeof url === 'string') {
            //     return url.slice(0, 18) + '/public' + url.slice(18);

            if (url.includes('http')) return url;
            else {
                // return `${MAIN_URL}/public/user-dash/images/users/profiles/${url}`;
                return '';
            }
        }
    },

    recudeFileName: (str) => {
        if (str.length > 25) return str.slice(0, 22) + '...';
        else return str;
    },

    convertTrackingTime: (t) => {
        const h = Math.floor(t / 3600);
        const m = Math.floor((t % 3600) / 60);
        const s = t % 60;

        return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    }

}