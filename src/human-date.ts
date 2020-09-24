export default class HumanDate {
  date: Date;
  intervals: { label: string, seconds: number }[] = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  constructor(date: string | Date) {
    if (typeof date == 'string') {
      date = new Date(date);
    }

    this.date = date;
  }

  ago(): string {
    let seconds  = Math.floor((Date.now() - this.date.getTime()) / 1000);
    let interval = this.intervals.find(i => i.seconds < seconds) || this.intervals[-1];
    let count    = Math.floor(seconds / interval.seconds);

    return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
  }
}
