import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
    name: "safeHtmlPipe",
    pure : false,
    standalone: true
  })
  export class SafeHtmlPipePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
  
    transform(html: any) {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }
  