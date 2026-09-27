# QA only: static server that forbids caching, so every check sees the files on disk.
import http.server, functools, sys

class NoStore(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, max-age=0')
        super().end_headers()

root = sys.argv[1]
http.server.ThreadingHTTPServer(('127.0.0.1', 8765), functools.partial(NoStore, directory=root)).serve_forever()
