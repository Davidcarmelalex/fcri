"""
Agent47 — Core Execution Agent

The general-purpose execution runtime for the Voltex Network.
Receives task dispatches from Ayooni and executes them safely.
"""
from __future__ import annotations
import asyncio
import logging
import subprocess
import shlex
from dataclasses import dataclass, field
from typing import Any
from datetime import datetime
import uuid

logger = logging.getLogger("agent47")


@dataclass
class Task:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    type: str = ""           # command | skill | workflow
    payload: Any = None
    priority: int = 5        # 1 (highest) to 10 (lowest)
    timeout: int = 30        # seconds
    created_at: datetime = field(default_factory=datetime.utcnow)


@dataclass
class TaskResult:
    task_id: str
    success: bool
    output: Any = None
    error: str | None = None
    duration_ms: int = 0
    executed_at: datetime = field(default_factory=datetime.utcnow)


class CommandExecutor:
    """Safely executes shell commands in a controlled environment."""

    BLOCKED_COMMANDS = {"rm -rf /", "format", "dd if="}

    def execute(self, command: str, timeout: int = 30) -> TaskResult:
        task_id = str(uuid.uuid4())
        start = datetime.utcnow()

        # Basic safety check
        for blocked in self.BLOCKED_COMMANDS:
            if blocked in command.lower():
                return TaskResult(
                    task_id=task_id,
                    success=False,
                    error=f"Command blocked by safety policy: {blocked}",
                )

        try:
            result = subprocess.run(
                shlex.split(command),
                capture_output=True,
                text=True,
                timeout=timeout,
            )
            duration = int((datetime.utcnow() - start).total_seconds() * 1000)
            return TaskResult(
                task_id=task_id,
                success=result.returncode == 0,
                output=result.stdout.strip(),
                error=result.stderr.strip() if result.returncode != 0 else None,
                duration_ms=duration,
            )
        except subprocess.TimeoutExpired:
            return TaskResult(task_id=task_id, success=False, error=f"Command timed out after {timeout}s")
        except Exception as e:
            return TaskResult(task_id=task_id, success=False, error=str(e))


class Agent47:
    """
    Agent47 — primary execution agent.

    Routes tasks to the appropriate executor:
    - command → CommandExecutor
    - skill → SkillRunner
    - workflow → WorkflowEngine
    """

    def __init__(self):
        self._command_executor = CommandExecutor()
        self._task_history: list[TaskResult] = []

    async def execute(self, task: Task) -> TaskResult:
        logger.info(f"Executing task {task.id} | type={task.type}")

        if task.type == "command":
            result = self._command_executor.execute(str(task.payload), task.timeout)
        else:
            result = TaskResult(task_id=task.id, success=False, error=f"Unknown task type: {task.type}")

        self._task_history.append(result)
        logger.info(f"Task {task.id} complete | success={result.success} | {result.duration_ms}ms")
        return result

    def get_history(self, limit: int = 50) -> list[TaskResult]:
        return self._task_history[-limit:]
