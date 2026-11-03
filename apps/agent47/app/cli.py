"""AGENT 47 local terminal interface. Requires model provider configuration."""
import json
from .runtime import run_agent


def main():
    session = None
    print("AGENT 47 // FCRI x AIBI | type /exit to quit")
    while True:
        try:
            prompt = input("47> ").strip()
            if prompt in ("/exit", "/quit"):
                break
            if not prompt:
                continue
            result = run_agent(prompt, session)
            session = result["session"]
            print(result["answer"])
        except (EOFError, KeyboardInterrupt):
            break
        except Exception as exc:
            print("Error:", exc)


if __name__ == "__main__":
    main()
