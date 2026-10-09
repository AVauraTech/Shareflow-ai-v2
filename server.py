#!/usr/bin/env python3
"""
ShareFlow AI 2.0 – Advanced Gamified Resource Sharing Ecosystem
Local Dev Server & Static Asset Host
"""

import http.server
import socketserver
import os
import sys
import webbrowser

PORT = 8080
DIRECTORY = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for dev
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    # Reconfigure stdout to utf-8 if supported
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

    os.chdir(DIRECTORY)
    
    print("=" * 65)
    print("  [*] SHAREFLOW AI 2.0: ADVANCED RESOURCE SHARING ECOSYSTEM")
    print("=" * 65)
    print(f"  Web Dashboard : http://localhost:{port}")
    print(f"  Geospatial Radar & AI Vision Lab ready.")
    print("=" * 65)
    print("  Press Ctrl+C to stop the server.\n")

    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", port), Handler) as httpd:
            # Auto-open browser on launch if --open is passed
            if "--open" in sys.argv:
                webbrowser.open(f"http://localhost:{port}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[+] ShareFlow server stopped.")
    except OSError as e:
        print(f"\n[!] Error binding to port {port}: {e}")
        print("    Try running with a different port: python server.py 8081")

if __name__ == "__main__":
    main()
