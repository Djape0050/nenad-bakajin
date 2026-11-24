param([int]$Port = 5173, [string]$Root = $PSScriptRoot)
# Minimal static file server (with HTTP Range support for video seeking)
$mime = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8'
  '.json'='application/json'; '.svg'='image/svg+xml'; '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'
  '.webp'='image/webp'; '.avif'='image/avif'; '.gif'='image/gif'; '.ico'='image/x-icon'; '.mp4'='video/mp4'
  '.webm'='video/webm'; '.woff2'='font/woff2'; '.woff'='font/woff'; '.txt'='text/plain; charset=utf-8'
}
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $Root at http://localhost:$Port/"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request; $res = $ctx.Response
  try {
    $path = [Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimStart('/')
    if ($path -eq '' -or $path.EndsWith('/')) { $path += 'index.html' }
    $file = Join-Path $Root $path
    if ((Test-Path $file -PathType Container)) { $file = Join-Path $file 'index.html' }
    if (-not (Test-Path $file -PathType Leaf)) {
      $res.StatusCode = 404; $b = [Text.Encoding]::UTF8.GetBytes('404'); $res.OutputStream.Write($b,0,$b.Length)
    } else {
      $ext = [IO.Path]::GetExtension($file).ToLower()
      $res.ContentType = $(if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' })
      $res.Headers.Add('Accept-Ranges','bytes'); $res.Headers.Add('Cache-Control','no-cache')
      $fs = [IO.File]::OpenRead($file); $len = $fs.Length
      $start = 0; $end = $len - 1
      $range = $req.Headers['Range']
      if ($range -and $range -match 'bytes=(\d*)-(\d*)') {
        if ($matches[1] -ne '') { $start = [int64]$matches[1] }
        if ($matches[2] -ne '') { $end = [Math]::Min([int64]$matches[2], $len - 1) }
        $res.StatusCode = 206
        $res.Headers.Add('Content-Range', "bytes $start-$end/$len")
      }
      $count = $end - $start + 1
      $res.ContentLength64 = $count
      $fs.Seek($start, 'Begin') | Out-Null
      $buf = New-Object byte[] 65536; $left = $count
      while ($left -gt 0) {
        $n = $fs.Read($buf, 0, [Math]::Min($buf.Length, $left)); if ($n -le 0) { break }
        $res.OutputStream.Write($buf, 0, $n); $left -= $n
      }
      $fs.Close()
    }
  } catch { } finally { try { $res.OutputStream.Close() } catch {} }
}
