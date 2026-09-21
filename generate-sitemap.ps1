$ErrorActionPreference = 'Stop'

$siteOrigin = 'https://twinexpeditions.com'
$root = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$excludedNames = @('footer.html', 'navbar.html', 'template.html')
$excludedPatterns = @('agb*.html')
$today = Get-Date -Format 'yyyy-MM-dd'

$urls = Get-ChildItem -Path $root -Recurse -File -Filter '*.html' |
  Where-Object {
    $file = $_
    $file.Name -notin $excludedNames -and
    -not ($excludedPatterns | Where-Object { $file.Name -like $_ })
  } |
  ForEach-Object {
    $relativePath = $_.FullName.Substring($root.Length + 1).Replace('\', '/')
    if ($relativePath -eq 'index.html') {
      $path = '/'
    } elseif ($relativePath -match '(^|/)index\.html$') {
      $path = '/' + $relativePath -replace 'index\.html$', ''
    } else {
      $path = '/' + $relativePath
    }

    [pscustomobject]@{
      Path = $path
      LastModified = if ($_.LastWriteTime.Date -gt (Get-Date).Date) { $today } else { $_.LastWriteTime.ToString('yyyy-MM-dd') }
    }
  } |
  Sort-Object Path -Unique

$xml = [System.Xml.XmlWriterSettings]::new()
$xml.Indent = $true
$xml.Encoding = [System.Text.UTF8Encoding]::new($false)
$output = [System.Text.StringBuilder]::new()
$writer = [System.Xml.XmlWriter]::Create($output, $xml)
$writer.WriteStartDocument()
$namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9'
$writer.WriteStartElement('urlset', $namespace)

foreach ($url in $urls) {
  $writer.WriteStartElement('url')
  $writer.WriteElementString('loc', $siteOrigin + $url.Path)
  $writer.WriteElementString('lastmod', $url.LastModified)
  $writer.WriteEndElement()
}

$writer.WriteEndElement()
$writer.WriteEndDocument()
$writer.Dispose()
[System.IO.File]::WriteAllText((Join-Path $root 'sitemap.xml'), $output.ToString(), [System.Text.UTF8Encoding]::new($false))