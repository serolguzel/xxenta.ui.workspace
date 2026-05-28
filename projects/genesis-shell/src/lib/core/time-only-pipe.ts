import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TimeOnly } from "genesis-coreservice";

@Pipe({
  name: "timeonly",
  pure: false,
  standalone: true
})
export class TimeOnlyPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(value: TimeOnly) {
    if (value) {
      return `${this.timeFormat(value.hour)}:${this.timeFormat(value.minute)}`;
    }
    return '';
  }

  private timeFormat(value: number): string {
    if(value >= 0 && value < 10)
      return `0${value}`;
    else
      return value.toString();
  }
}
