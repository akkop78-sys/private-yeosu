# -*- coding: utf-8 -*-
"""여수 오천동 프라이빗펜션 홈페이지 로컬 서버."""

import http.server
import os
import socketserver
import webbrowser

PORT = 8080
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)


if __name__ == "__main__":
    os.chdir(ROOT)
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        url = f"http://127.0.0.1:{PORT}/"
        print(f"프라이빗펜션 홈페이지: {url}")
        print("종료하려면 Ctrl+C 를 누르세요.")
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n서버를 종료합니다.")
