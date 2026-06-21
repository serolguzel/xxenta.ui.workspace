export interface GenesisColumn {
  /** Veri alanı. İç içe alanlar nokta ile desteklenir, örn. "company.name". */
  field: string;
  /** Başlık metni (zaten çevrilmiş olarak verilir). */
  header: string;
  /** Hücre gösterim tipi. 'boolean' → tik/çarpı; 'date' → dd.MM.yyyy; 'datetime' → dd.MM.yyyy HH:mm. Varsayılan 'text'. */
  type?: 'text' | 'boolean' | 'date' | 'datetime';
  /** Sütun sıralanabilir mi. */
  sortable?: boolean;
  /** Sütunda "contains" filtre satırı gösterilsin mi. */
  filter?: boolean;
  /** İsteğe bağlı sabit genişlik, örn. "100px". */
  width?: string;
  /** Başlangıçta gizli olsun mu (column-chooser ile açılabilir). */
  hidden?: boolean;
}

export interface GenesisSummary {
  /** Toplamın gösterileceği sütun alanı. */
  column: string;
  /** Özet tipi. */
  type: 'sum' | 'count' | 'avg' | 'min' | 'max';
  /** İsteğe bağlı önek etiketi, örn. "Toplam:". */
  label?: string;
}
