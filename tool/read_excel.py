import openpyxl
import json

wb = openpyxl.load_workbook(
    r'c:\Users\andre\Desktop\WebProject\tool\ICHA_PROFILES.xlsx')
out = open(r'c:\Users\andre\Desktop\WebProject\tool\excel_clean.txt',
           'w', encoding='utf-8')

out.write(f"Total sheets: {len(wb.sheetnames)}\n")
out.write(f"Sheet names: {wb.sheetnames}\n\n")

for sname in wb.sheetnames:
    ws = wb[sname]
    out.write(f"\n{'='*80}\n")
    out.write(f"SHEET: {sname}\n")
    out.write(f"{'='*80}\n")

    # Only print rows that have at least one non-None value
    row_count = 0
    for r in range(1, ws.max_row + 1):
        row = [ws.cell(r, c).value for c in range(1, ws.max_column + 1)]
        # Skip completely empty rows
        if any(v is not None for v in row):
            # Trim trailing Nones for cleaner output
            while row and row[-1] is None:
                row.pop()
            out.write(f"R{r}: {row}\n")
            row_count += 1

    out.write(f"--- {row_count} non-empty rows ---\n")

out.close()
print("Done! Written to excel_clean.txt")
