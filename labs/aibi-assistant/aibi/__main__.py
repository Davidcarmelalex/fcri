import argparse
import os
from pathlib import Path

from .core import ROLES, Store
from .server import Server


def main():
    parser = argparse.ArgumentParser(description="FCRI Labs AIBI assistant (mock adapters)")
    parser.add_argument("--db", default="runtime/aibi.sqlite")
    sub = parser.add_subparsers(dest="command", required=True)
    user = sub.add_parser("user", help="Local operator: provision identity and write a private token file")
    user.add_argument("--tenant", required=True)
    user.add_argument("--user", required=True)
    user.add_argument("--role", required=True, choices=sorted(ROLES))
    user.add_argument("--token-file", required=True)
    user.add_argument("--hours", type=int, default=12)
    revoke = sub.add_parser("revoke")
    revoke.add_argument("--tenant", required=True)
    revoke.add_argument("--user", required=True)
    for name in ("seed-demo", "purge"):
        p = sub.add_parser(name)
        p.add_argument("--tenant", required=True)
        if name == "seed-demo":
            p.add_argument("--user", required=True)
    serve = sub.add_parser("serve")
    serve.add_argument("--port", type=int, default=4780)
    args = parser.parse_args()
    db = Path(args.db)
    db.parent.mkdir(parents=True, exist_ok=True)
    store = Store(db)
    if args.command == "user":
        path = Path(args.token_file)
        path.parent.mkdir(parents=True, exist_ok=True)
        # Exclusive creation prevents clobbering existing files/symlink targets.
        fd = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        try:
            token = store.issue_token(args.tenant, args.user, args.role, args.hours)
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                f.write(token)
        except Exception:
            path.unlink(missing_ok=True)
            raise
        print("Credential written. Protect this file with user-only filesystem permissions.")
    elif args.command == "revoke":
        store.revoke(args.tenant, args.user)
        print("User credentials revoked.")
    elif args.command == "seed-demo":
        store.seed(args.tenant, args.user)
        print("Synthetic demo records created.")
    elif args.command == "purge":
        store.purge(args.tenant)
        print("Expired tenant data purged.")
    else:
        server = Server(("127.0.0.1", args.port), store)
        print(f"AIBI mock assistant: http://127.0.0.1:{args.port}")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            server.server_close()


if __name__ == "__main__":
    main()
