param(
  [string]$Name = 'iphone-430',
  [int]$Width = 430,
  [int]$Height = 932,
  [int]$Mobile = 1
)

$ErrorActionPreference = 'Stop'

$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$userData = Join-Path $env:TEMP ('karin-cdp-' + [guid]::NewGuid().ToString('N'))
$chromeProcess = Start-Process -FilePath $chrome -ArgumentList @(
  '--headless=new',
  '--remote-debugging-port=9224',
  '--remote-allow-origins=*',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  "--user-data-dir=$userData",
  'http://localhost:3002/'
) -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 5
Write-Host 'chrome-ready'

$list = Invoke-RestMethod -Uri 'http://localhost:9224/json/list'
$page = $list | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
Write-Host "page:$($page.id)"
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
Write-Host 'ws-connected'

$script:MessageId = 0

function Receive-Cdp($WantedId) {
  $all = New-Object System.Collections.Generic.List[byte]

  do {
    $buf = New-Object byte[] 1048576
    $seg = [ArraySegment[byte]]::new($buf)
    $res = $ws.ReceiveAsync($seg, [Threading.CancellationToken]::None).GetAwaiter().GetResult()

    if ($res.Count -gt 0) {
      $chunk = New-Object byte[] $res.Count
      [Array]::Copy($buf, 0, $chunk, 0, $res.Count)
      $all.AddRange($chunk)
    }
  } while (-not $res.EndOfMessage)

  $txt = [Text.Encoding]::UTF8.GetString($all.ToArray())
  $msg = $txt | ConvertFrom-Json

  if ($msg.id -eq $WantedId) {
    return $msg
  }

  return Receive-Cdp $WantedId
}

function Send-Cdp($Method, $Params = $null) {
  $script:MessageId++
  $payload = @{ id = $script:MessageId; method = $Method }

  if ($null -ne $Params) {
    $payload.params = $Params
  }

  $json = $payload | ConvertTo-Json -Depth 20 -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($json)
  $ws.SendAsync(
    [ArraySegment[byte]]::new($bytes),
    [System.Net.WebSockets.WebSocketMessageType]::Text,
    $true,
    [Threading.CancellationToken]::None
  ).GetAwaiter().GetResult()

  Receive-Cdp $script:MessageId
}

Send-Cdp 'Page.enable' | Out-Null
Write-Host 'page-enabled'
Send-Cdp 'Runtime.enable' | Out-Null
Write-Host 'runtime-enabled'

$measureJs = @'
(async () => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const clean = (n) => Math.round(n * 100) / 100;
  const bounds = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: clean(r.left), right: clean(r.right), top: clean(r.top), bottom: clean(r.bottom), width: clean(r.width), height: clean(r.height) };
  };
  const inViewportX = (r) => !!r && r.left >= -0.5 && r.right <= window.innerWidth + 0.5;
  const sectionOverflow = (section) => section ? clean(section.scrollWidth - section.clientWidth) : null;
  const result = { viewport: { width: innerWidth, height: innerHeight }, documentOverflow: clean(document.documentElement.scrollWidth - document.documentElement.clientWidth) };

  const testimonials = document.querySelector('#testimonios');
  testimonials?.scrollIntoView({ block: 'start' });
  await wait(900);
  const tScroller = testimonials?.querySelector('[role="list"]');
  const tCard = testimonials?.querySelector('article[aria-current="true"]') || testimonials?.querySelector('article');
  const story = testimonials?.querySelector('aside[aria-label="Resumen del testimonio activo"]');
  const storyBefore = story?.innerText || '';
  const dots = testimonials ? Array.from(testimonials.querySelectorAll('[aria-label="Seleccionar testimonio"] button')) : [];

  if (dots[1]) {
    dots[1].click();
    await wait(850);
  }

  const tCardAfter = testimonials?.querySelector('article[aria-current="true"]') || testimonials?.querySelector('article');
  result.testimonials = {
    sectionOverflow: sectionOverflow(testimonials),
    scrollerOverflow: tScroller ? clean(tScroller.scrollWidth - tScroller.clientWidth) : null,
    activeCard: bounds(tCard),
    activeCardFullyVisible: inViewportX(bounds(tCard)),
    activeCardAfter: bounds(tCardAfter),
    activeCardAfterFullyVisible: inViewportX(bounds(tCardAfter)),
    storyPanel: bounds(story),
    storyVisible: inViewportX(bounds(story)),
    storyBefore,
    storyAfter: story?.innerText || '',
    storyChangedAfterDot: storyBefore !== (story?.innerText || '')
  };

  const catalog = document.querySelector('#catalogo');
  catalog?.scrollIntoView({ block: 'start' });
  await wait(900);
  const gallery = catalog?.querySelector('[class*="gallery"]');
  const cards = catalog ? Array.from(catalog.querySelectorAll('article')).slice(0, 8) : [];
  result.catalog = {
    sectionOverflow: sectionOverflow(catalog),
    gallery: bounds(gallery),
    cardCount: cards.length,
    cards: cards.map((card) => ({ bounds: bounds(card), fullyVisible: inViewportX(bounds(card)) }))
  };

  if (cards[0]) {
    cards[0].click();
    await wait(700);
    const dialog = document.querySelector('[role="dialog"]');
    result.catalog.modalOpened = !!dialog;
    result.catalog.modal = bounds(dialog);
    result.catalog.modalOverflow = dialog ? clean(dialog.scrollWidth - dialog.clientWidth) : null;
    const close = dialog?.querySelector('button[aria-label="Cerrar galería"]');
    close?.click();
    await wait(250);
  }

  result.finalDocumentOverflow = clean(document.documentElement.scrollWidth - document.documentElement.clientWidth);
  return result;
})()
'@

$viewports = @(
  @{ name = $Name; width = $Width; height = $Height; mobile = $Mobile }
)

$results = @()

foreach ($vp in $viewports) {
  Write-Host "viewport:$($vp.name)"
  Send-Cdp 'Emulation.setDeviceMetricsOverride' @{
    width = $vp.width
    height = $vp.height
    deviceScaleFactor = 1
    mobile = [bool]$vp.mobile
  } | Out-Null

  Send-Cdp 'Page.navigate' @{ url = 'http://localhost:3002/' } | Out-Null
  Write-Host 'navigated'
  Start-Sleep -Seconds 3

  $eval = Send-Cdp 'Runtime.evaluate' @{
    expression = $measureJs
    awaitPromise = $true
    returnByValue = $true
  }
  Write-Host 'evaluated'

  $value = $eval.result.result.value

  $results += [pscustomobject]@{
    name = $vp.name
    metrics = $value
  }
}

$ws.CloseAsync(
  [System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,
  'done',
  [Threading.CancellationToken]::None
).GetAwaiter().GetResult()

if (-not $chromeProcess.HasExited) {
  Stop-Process -Id $chromeProcess.Id -Force
}

$results | ConvertTo-Json -Depth 20
