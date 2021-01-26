import { Row, Table } from "./table.ts";

export default class HTMLTable extends Table {
  normalize(value: string): string {
    // deno-lint-ignore no-control-regex
    return value.replaceAll(/[^\x1b -~]/g, "");
  }
  add(row: Row): void {
    this.rows.push(this.normalizeRow(row));
  }
  render(): void {
    // skeleton css
    let HTML =
      '<head><title>game-db results</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css" integrity="sha512-EZLkOqwILORob+p0BXZc+Vm3RgJBOe1Iq/0fiI7r/wJgzOFZMlsqTa29UEl6v6U6gsV4uIpsNZoV32YZqrCRCQ==" crossorigin="anonymous" /></head>';

    HTML += '<body><table style="width:100%">';

    if (this.header) {
      HTML += "<thead><tr>";
      this.header.forEach((title) => {
        HTML += `<th>${title}</th>`;
      });
      HTML += "</tr></thead>";
    }

    HTML += "<tbody>";
    this.rows.forEach((row) => {
      HTML += `<tr><th>${row.join("</th><th>")}</th></tr>`;
    });
    HTML += "</tbody>";

    HTML += "</table></body>";
    console.log(HTML);
  }
}
