import {Component, Input, OnDestroy, OnInit, Output, EventEmitter} from '@angular/core';
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-count-down',
  template: `
    <span class="count-down">{{daysToDday}} - {{hoursToDday}}:{{minutesToDday}}:{{secondsToDday}}</span>
  `
})
export class CountDownComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  @Input() dateNowString: string;
  @Input() dateNow = new Date();
  @Input() dDay = new Date('Jan 01 2021 00:00:00');
  @Input() inNSeconds = 0;
  @Output() countdownFinish = new EventEmitter();
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;


  private getTimeDifference(): void {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference): void {
    if (timeDifference <= 0) {
      this.subscription.unsubscribe();
      timeDifference = 0;
      this.countdownFinish.emit(true);
    }
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute).toString().padStart(2, '0');
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute).toString().padStart(2, '0');
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay).toString().padStart(2, '0');
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

  ngOnInit(): void {
    if (this.dateNowString) {
      this.dateNow = new Date(this.dateNowString);
    }
    if (this.inNSeconds > 0) {
      this.dDay.setTime(this.dateNow.getTime() + this.inNSeconds * 1000);
    }

    console.log(this.dateNowString);
    console.log(this.dateNow);
    console.log(this.dDay);

    this.subscription = interval(1000)
      .subscribe(x => {
        this.getTimeDifference();
      });
    this.getTimeDifference();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
