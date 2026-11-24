# Lager de to valideringsfilene som må være lagret fra Excel (Story 1.5, AD-15).
#
# Krever Excel for Windows. Kjør fra hvilken som helst mappe:
#   powershell -ExecutionPolicy Bypass -File testdata/lag_excelfiler.ps1
#
# Begge filene bygger på testeksempel-02.xlsx:
# - validering/V-F10.xlsx: lagret med passordet «cosi». Appen skal avvise den (NFR-9, PASSORDBESKYTTET).
# - validering/V-G05.xlsx: lagret på nytt i Excel, med formelen =200+200 i Stykkliste!F5 i stedet for tallet 400.
#   Excel lagrer da verdiene til alle formlene (også Kontroll-kolonnen og hjelpekolonnene). Filen er gyldig og gir 0 feil.
#
# Filene fra lag_testdata.py har ingen lagrede formelverdier, så de kan ikke vise at appen leser
# verdier og ikke formler. Dette skriptet lager filene som kan det. Excel skriver tidspunkt i filene,
# så en ny kjøring gir ikke like bytes, men likt innhold.
#
# NB: `lag_testdata.py --alle` sletter V-filer den ikke kjenner. Kjør dette skriptet på nytt etterpå.

$ErrorActionPreference = 'Stop'

$kilde = Join-Path $PSScriptRoot 'testeksempel-02.xlsx'
$validering = Join-Path $PSScriptRoot 'validering'
$passordfil = Join-Path $validering 'V-F10.xlsx'
$formelfil = Join-Path $validering 'V-G05.xlsx'

$XL_OPENXML_WORKBOOK = 51

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    foreach ($fil in @($passordfil, $formelfil)) {
        if (Test-Path $fil) { Remove-Item $fil -Force -Confirm:$false }
    }

    # V-F10: testeksempel 02 med passord
    $bok = $excel.Workbooks.Open($kilde)
    try {
        $excel.CalculateFull()
        $bok.SaveAs($passordfil, $XL_OPENXML_WORKBOOK, 'cosi')
    } finally {
        $bok.Close($false)
        [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($bok)
    }

    # V-G05: testeksempel 02 med en formel som gir samme verdi som før
    $bok = $excel.Workbooks.Open($kilde)
    try {
        $celle = $bok.Worksheets.Item('Stykkliste').Range('F5')
        if ($celle.Value2 -ne 400) { throw "Stykkliste!F5 i testeksempel 02 er $($celle.Value2), ikke 400." }
        $celle.Formula = '=200+200'
        $excel.CalculateFull()
        $bok.SaveAs($formelfil, $XL_OPENXML_WORKBOOK)
        [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($celle)
    } finally {
        $bok.Close($false)
        [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($bok)
    }
} finally {
    $excel.Quit()
    [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel)
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

Write-Output "Laget $passordfil"
Write-Output "Laget $formelfil"
