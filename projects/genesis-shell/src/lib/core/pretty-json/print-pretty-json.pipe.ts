export type FormatSettings = {
  indent: number;   // number of spaces for indentation
  lineNumbers: boolean;  // wrap HTML in an <ol> tag to support line numbers
  linkUrls: boolean;  // create anchor tags for URLs
  linksNewTab: boolean;  // add a target=_blank attribute setting to anchor tags
  quoteKeys: boolean;  // always double quote key names
  trailingCommas: boolean;  // append a comma after the last item in arrays and objects
};

export type FormatOptions = Partial<FormatSettings>;
export type JsonType = 'key' | 'string' | 'number' | 'boolean' | 'null' | 'mark';

export abstract class PrettyPrintJson {
  public static toHtml(data: unknown, options?: FormatOptions): string {
    // Converts an object or primitive into an HTML string suitable for rendering.
    const defaults: FormatSettings = {
      indent: 3,
      lineNumbers: false,
      linkUrls: true,
      linksNewTab: true,
      quoteKeys: false,
      trailingCommas: true,
    };

    const settings = { ...defaults, ...options };
    const invalidHtml = /[<>&]|\\"/g;

    const toHtml = (char: string): string => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\\"': return '&bsol;&quot;';
        default: return char;
      }
    };

    const spanTag = (type: JsonType, display?: string): string =>
      display ? `<span class="json-${type}">${display}</span>` : '';

    const buildValueHtml = (value: string): string => {
      // Analyzes a value and returns HTML like: "<span class=json-number>3.1415</span>"
      const strType = value.startsWith('"') ? 'string' : null;
      const boolType = ['true', 'false'].includes(value) ? 'boolean' : null;
      const nullType = value === 'null' ? 'null' : null;
      const type = boolType || nullType || strType || 'number';

      if (strType && settings.linkUrls) {
        const urlPattern = /https?:\/\/[^\s"]+/g;
        const target = settings.linksNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
        const makeLink = (link: string) =>
          `<a class="json-link" href="${link}"${target}>${link}</a>`;
        return spanTag(type, value.replace(urlPattern, makeLink));
      }

      return spanTag(type, value);
    };

    const replacer = (match: string, indent: string, key: string, value: string, end: string): string => {
      const findName = settings.quoteKeys ? /(.*)(): / : /"([\w$]+)": |(.*): /;
      const indentHtml = indent || '';
      const keyName = key?.replace(findName, '$1$2') || '';
      const keyHtml = key ? spanTag('key', keyName) + spanTag('mark', ': ') : '';
      const valueHtml = value ? buildValueHtml(value) : '';

      const shouldAddComma = settings.trailingCommas && match.startsWith(' ') &&
        end && ![']', '}'].includes(match.slice(-1));
      const endHtml = spanTag('mark', shouldAddComma ? (end || '') : end || '');

      return indentHtml + keyHtml + valueHtml + endHtml;
    };

    const jsonLine = /^( *)("[^"]+": )?("[^"]*"|[\w.+-]*)?([{}[\],]*)?$/mg;

    try {
      const json = data === undefined ? 'undefined' : JSON.stringify(data, null, settings.indent);
      if (!json) return 'undefined';

      const escapedJson = json.replace(invalidHtml, toHtml);
      const html = escapedJson.replace(jsonLine, replacer);

      if (settings.lineNumbers) {
        const lines = html.split('\n').map(line => `<li>${line}</li>`);
        return `<ol class="json-lines">${lines.join('')}</ol>`;
      }

      return html;
    } catch (error) {
      console.error('Error formatting JSON:', error);
      return 'Invalid JSON';
    }
  }
};