import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CoreService } from 'genesis-coreservice';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { GenesisCellDirective } from './genesis-cell.directive';
import { GenesisColumn, GenesisSummary } from './genesis-data-table.models';

/** Sağ taraftaki işlem (actions) sütunu için rezerve edilmiş template alanı. */
const ACTIONS_FIELD = '$actions';
/** Satır genişletme (master-detail) içeriği için rezerve edilmiş template alanı. */
const EXPANSION_FIELD = '$expansion';
/** Ekle/düzenle dialog formu için rezerve edilmiş template alanı. */
const EDITOR_FIELD = '$editor';
/** Toolbar'ın sol tarafı (başlık yanı, filtreler) için rezerve template. */
const TOOLBAR_START_FIELD = '$toolbarStart';
/** Toolbar'ın sağ tarafı (arama yanı, aksiyon butonları) için rezerve template. */
const TOOLBAR_END_FIELD = '$toolbarEnd';

@Component({
  selector: 'genesis-data-table',
  templateUrl: './genesis-data-table.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
    ConfirmDialogModule,
    MultiSelectModule,
  ],
  providers: [ConfirmationService]
})
export class GenesisDataTableComponent implements OnInit, AfterContentInit {
  private readonly coreService = inject(CoreService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly translocoService = inject(TranslocoService);

  /** Sütun tanımları. */
  @Input() columns: GenesisColumn[] = [];
  /** Verinin çekileceği endpoint, örn. "Organization". */
  @Input() loadPath!: string;
  /** Her isteğe eklenecek sabit parametreler, örn. { isTenant: true }. */
  @Input() extraParams: any = {};
  /** true: server-side (skip/take/sort/filter); false: tüm veri bir kez çekilir, filtre/sıralama/sayfalama client-side. */
  @Input() lazy: boolean = true;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [10, 20, 30];
  @Input() title: string = '';
  @Input() showCreateButton: boolean = false;
  @Input() dataKey: string = 'id';
  /** İşlem sütununun genişliği. */
  @Input() actionsWidth: string = '120px';
  /** Üstte arama kutusu gösterilsin mi. */
  @Input() showSearch: boolean = true;
  /** Kolon görünürlük seçici (column chooser) gösterilsin mi. */
  @Input() columnChooser: boolean = false;
  /** Footer özet (toplam/sayım) tanımları. */
  @Input() summary: GenesisSummary[] = [];

  // --- Editing (CRUD) ---
  /** true ise ekle/düzenle/sil butonları ve $editor dialog'u aktifleşir. */
  @Input() editable: boolean = false;
  /** Ekleme endpoint'i (POST). */
  @Input() insertPath?: string;
  /** Güncelleme endpoint'i (PUT {updatePath}/{key}). */
  @Input() updatePath?: string;
  /** Silme endpoint'i (DELETE {deletePath}/{key}). */
  @Input() deletePath?: string;
  /** PUT/DELETE çağrılarında satır anahtarı olarak kullanılacak alan. */
  @Input() updateKey: string = 'id';
  /** Dialog başlığı. */
  @Input() editorTitle: string = '';
  /** Dialog genişliği. */
  @Input() editorWidth: string = '500px';
  /** Yeni satır oluşturulurken kullanılacak varsayılan değerler. */
  @Input() newRowDefaults: any = {};

  @Output() createClick = new EventEmitter<void>();

  @ContentChildren(GenesisCellDirective) cellDirectives!: QueryList<GenesisCellDirective>;

  rows: any[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  summaryValues: any[] = [];
  /** Column-chooser ile yönetilen görünür sütun alanları. */
  visibleFields: string[] = [];

  // Dialog state
  editVisible: boolean = false;
  editingRow: any = {};
  isNew: boolean = false;

  private templates = new Map<string, TemplateRef<any>>();
  private lastLazyEvent?: TableLazyLoadEvent;

  ngOnInit(): void {
    this.visibleFields = this.columns.filter(c => !c.hidden).map(c => c.field);
    if (!this.lazy) {
      this.loadClientSide();
    }
  }

  ngAfterContentInit(): void {
    this.cellDirectives.forEach(d => this.templates.set(d.field, d.template));
  }

  // --- Template erişimleri ---
  get hasActions(): boolean { return this.templates.has(ACTIONS_FIELD); }
  get actionsTemplate(): TemplateRef<any> | undefined { return this.templates.get(ACTIONS_FIELD); }
  get hasExpansion(): boolean { return this.templates.has(EXPANSION_FIELD); }
  get expansionTemplate(): TemplateRef<any> | undefined { return this.templates.get(EXPANSION_FIELD); }
  get hasEditor(): boolean { return this.templates.has(EDITOR_FIELD); }
  get editorTemplate(): TemplateRef<any> | undefined { return this.templates.get(EDITOR_FIELD); }
  get toolbarStartTemplate(): TemplateRef<any> | undefined { return this.templates.get(TOOLBAR_START_FIELD); }
  get toolbarEndTemplate(): TemplateRef<any> | undefined { return this.templates.get(TOOLBAR_END_FIELD); }

  /** Görünür sütunlar (column-chooser filtresi uygulanmış). */
  get displayColumns(): GenesisColumn[] {
    return this.columns.filter(c => this.visibleFields.includes(c.field));
  }

  /** Otomatik düzenle/sil butonları gösterilsin mi (editable ve özel $actions yoksa). */
  get showAutoActions(): boolean { return this.editable && !this.hasActions; }
  /** İşlem sütunu (özel veya otomatik) var mı. */
  get hasActionsColumn(): boolean { return this.hasActions || this.showAutoActions; }

  /** Caption'da ekle butonu gösterilsin mi. */
  get showAddButton(): boolean { return (this.editable && this.hasEditor) || this.showCreateButton; }

  get globalFilterFields(): string[] { return this.displayColumns.map(c => c.field); }

  get hasSummary(): boolean { return this.summary.length > 0 && this.summaryValues.length > 0; }

  get colspan(): number {
    return this.displayColumns.length + (this.hasActionsColumn ? 1 : 0) + (this.hasExpansion ? 1 : 0);
  }

  cellTemplate(field: string): TemplateRef<any> | undefined { return this.templates.get(field); }

  resolveValue(row: any, field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], row);
  }

  /** Bir sütuna ait özet değerini döndürür (footer için). */
  summaryFor(field: string): { value: any; label?: string } | null {
    const idx = this.summary.findIndex(s => s.column === field);
    if (idx < 0) return null;
    return { value: this.summaryValues[idx], label: this.summary[idx].label };
  }

  // --- Veri yükleme ---
  load(event: TableLazyLoadEvent): void {
    this.lastLazyEvent = event;
    this.loading = true;

    const request: any = {
      skip: event.first ?? 0,
      take: event.rows ?? this.pageSize,
      requireTotalCount: true,
      ...this.extraParams,
    };

    if (event.sortField) {
      const field = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
      request.sort = JSON.stringify([{ selector: field, desc: event.sortOrder === -1 }]);
    }

    if (event.globalFilter) {
      request.searchValue = event.globalFilter;
    }

    const columnFilters = this.buildColumnFilters(event.filters);
    if (columnFilters) {
      request.filter = JSON.stringify(columnFilters);
    }

    if (this.summary.length) {
      request.totalSummary = JSON.stringify(this.summary.map(s => ({ selector: s.column, summaryType: s.type })));
    }

    this.coreService.getCall(this.loadPath, request).then((data: any) => {
      this.rows = Array.isArray(data) ? data : (data?.data ?? []);
      this.totalRecords = Array.isArray(data) ? data.length : (data?.totalCount ?? 0);
      this.summaryValues = data?.summary ?? [];
      this.loading = false;
      // Mock API delay:0 ile senkron çözülünce aynı CD turunda değişim olur;
      // ExpressionChangedAfterItHasBeenCheckedError'ı önlemek için ayrı tur tetikle.
      this.cdr.detectChanges();
    });
  }

  private loadClientSide(): void {
    this.loading = true;
    this.coreService.getCall(this.loadPath, this.extraParams).then((data: any) => {
      this.rows = Array.isArray(data) ? data : (data?.data ?? []);
      this.totalRecords = this.rows.length;
      this.computeClientSummary();
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  private computeClientSummary(): void {
    if (!this.summary.length) return;
    this.summaryValues = this.summary.map(s => {
      const nums = this.rows.map(r => this.resolveValue(r, s.column)).filter(v => v != null);
      switch (s.type) {
        case 'count': return this.rows.length;
        case 'sum': return nums.reduce((a, b) => a + Number(b), 0);
        case 'avg': return nums.length ? nums.reduce((a, b) => a + Number(b), 0) / nums.length : 0;
        case 'min': return nums.length ? Math.min(...nums.map(Number)) : null;
        case 'max': return nums.length ? Math.max(...nums.map(Number)) : null;
        default: return null;
      }
    });
  }

  /** Tabloyu mevcut moda göre yeniden yükler. */
  reload(): void {
    if (this.lazy) {
      this.load(this.lastLazyEvent ?? { first: 0, rows: this.pageSize });
    } else {
      this.loadClientSide();
    }
  }

  // --- CRUD ---
  addRow(): void {
    if (this.editable && this.hasEditor) {
      this.editingRow = { ...this.newRowDefaults };
      this.isNew = true;
      this.editVisible = true;
    } else {
      this.createClick.emit();
    }
  }

  editRow(row: any): void {
    this.editingRow = { ...row };
    this.isNew = false;
    this.editVisible = true;
  }

  saveRow(): void {
    const row = this.editingRow;
    const done = () => { this.editVisible = false; this.reload(); };

    if (this.isNew) {
      if (!this.insertPath) return;
      this.coreService.postCall(this.insertPath, row).then(done);
    } else {
      if (!this.updatePath) return;
      this.coreService.putCall(`${this.updatePath}/${row[this.updateKey]}`, row).then(done);
    }
  }

  cancelEdit(): void {
    this.editVisible = false;
  }

  deleteRow(row: any): void {
    this.confirmationService.confirm({
      header: this.translocoService.translate('messages.are-you-sure'),
      message: this.translocoService.translate('messages.delete-confirmation-description'),
      accept: () => {
        if (!this.deletePath) return;
        this.coreService.deleteCall(`${this.deletePath}/${row[this.updateKey]}`).then(() => this.reload());
      }
    });
  }

  private buildColumnFilters(filters: any): any[] | null {
    if (!filters) return null;
    const parts: any[] = [];
    Object.keys(filters).forEach(field => {
      const entry = filters[field];
      const constraints = Array.isArray(entry) ? entry : (entry?.constraints ?? []);
      constraints.forEach((c: any) => {
        if (c.value !== null && c.value !== undefined && c.value !== '') {
          if (parts.length > 0) parts.push('and');
          parts.push([field, 'contains', c.value]);
        }
      });
    });
    return parts.length > 0 ? parts : null;
  }
}
