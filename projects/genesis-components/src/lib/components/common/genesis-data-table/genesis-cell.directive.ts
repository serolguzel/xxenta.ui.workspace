import { Directive, Input, TemplateRef, inject } from '@angular/core';

/**
 * Bir sütunun hücre içeriğini özelleştirmek için kullanılır.
 * Kullanım: <ng-template gdtCell="fieldName" let-row>...</ng-template>
 * Template bağlamı: $implicit = satır verisi (row).
 */
@Directive({
  selector: '[gdtCell]',
  standalone: true
})
export class GenesisCellDirective {
  @Input('gdtCell') field!: string;
  readonly template = inject(TemplateRef);
}
