# Cloudflare Tunnel Setup

## Overview

Zen-proxy mendukung Cloudflare Tunnel untuk mengekspos server lokal ke internet tanpa membuka port atau menggunakan IP publik.

## Fitur Endpoint Modal

Klik pada **nama model** di card untuk membuka popup yang menampilkan:

- **LOCAL**: Endpoint lokal (http://localhost:8787/v1/{model}/chat/completions)
- **TUNNEL**: Endpoint Cloudflare tunnel (jika aktif)
- **MODEL**: Nama model yang diklik

Setiap endpoint memiliki tombol copy untuk menyalin URL dengan mudah.

## Setup Cloudflare Tunnel

### 1. Install cloudflared

```bash
# Linux (Debian/Ubuntu)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Termux (Android)
pkg install cloudflared
```

### 2. Login ke Cloudflare

```bash
cloudflared tunnel login
```

Browser akan terbuka untuk autentikasi. Pilih domain yang ingin digunakan.

### 3. Buat Tunnel

```bash
# Buat tunnel baru
cloudflared tunnel create zen-proxy

# Catat Tunnel ID yang muncul
```

### 4. Konfigurasi Tunnel

Buat file `~/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /home/zero/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: your-subdomain.yourdomain.com
    service: http://localhost:8787
  - service: http_status:404
```

### 5. Route DNS

```bash
cloudflared tunnel route dns zen-proxy your-subdomain.yourdomain.com
```

### 6. Jalankan Tunnel

```bash
# Jalankan tunnel
cloudflared tunnel run zen-proxy

# Atau jalankan sebagai service
cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

### 7. Set Environment Variable

Tambahkan URL tunnel ke environment variable agar muncul di dashboard:

```bash
export TUNNEL_URL=https://your-subdomain.yourdomain.com
```

Atau tambahkan ke `.env`:

```
TUNNEL_URL=https://your-subdomain.yourdomain.com
```

Restart zen-proxy server:

```bash
pm2 restart zen-proxy
# atau
node server.js
```

## Tunnel Tanpa Domain (Quick Tunnel)

Untuk testing cepat tanpa setup domain:

```bash
cloudflared tunnel --url http://localhost:8787
```

Cloudflared akan memberikan URL temporary seperti `https://random-name.trycloudflare.com`.

**Note**: Quick tunnel URL berubah setiap kali restart dan tidak cocok untuk production.

## Verifikasi

1. Buka dashboard: http://localhost:8787/dashboard
2. Klik pada nama model di card
3. Popup akan menampilkan:
   - LOCAL endpoint (selalu aktif)
   - TUNNEL endpoint (jika TUNNEL_URL di-set)
   - MODEL name

## Toggle Tunnel

Tombol power di sebelah TUNNEL endpoint:
- **Hijau/Cyan**: Tunnel aktif
- **Merah**: Tunnel tidak aktif

**Note**: Toggle button saat ini hanya menampilkan status. Untuk start/stop tunnel, gunakan command line atau systemctl.

## Troubleshooting

### Tunnel tidak muncul di dashboard

1. Pastikan `TUNNEL_URL` sudah di-set di environment
2. Restart zen-proxy server
3. Refresh dashboard
4. Check `/api/status` endpoint:
   ```bash
   curl http://localhost:8787/api/status | grep tunnel_url
   ```

### Tunnel URL tidak bisa diakses

1. Pastikan cloudflared tunnel sedang running:
   ```bash
   sudo systemctl status cloudflared
   # atau
   ps aux | grep cloudflared
   ```

2. Check cloudflared logs:
   ```bash
   sudo journalctl -u cloudflared -f
   ```

3. Pastikan DNS sudah propagate (bisa memakan waktu beberapa menit)

### CSRF token error dari tunnel

Dashboard otomatis mendeteksi request dari browser dan memerlukan CSRF token. Jika menggunakan curl atau API client, CSRF tidak diperlukan.

## Security Notes

- Tunnel mengekspos server ke internet - pastikan `PROXY_KEY` di-set untuk proteksi
- Gunakan HTTPS (tunnel Cloudflare otomatis menggunakan HTTPS)
- Monitor access logs untuk aktivitas mencurigakan
- Pertimbangkan rate limiting untuk production use

## Alternative: Tailscale

Jika tidak ingin mengekspos ke public internet, gunakan Tailscale untuk private network:

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Login
sudo tailscale up

# Access dari device lain di Tailscale network
http://<tailscale-ip>:8787
```
