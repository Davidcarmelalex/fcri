package com.mrnothing.agent.core

/**
 * Task planner — breaks high-level intents into executable steps.
 * 
 * The planner is responsible for:
 * 1. Parsing natural language into structured intents
 * 2. Breaking complex tasks into ordered sub-tasks
 * 3. Routing sub-tasks to the appropriate agents
 * 4. Handling failures and retries
 */
class TaskPlanner(
    private val agents: List<Agent>,
) {
    suspend fun plan(text: String, context: AgentContext): ExecutionPlan {
        // TODO: Replace with LLM-powered intent parsing
        val intent = parseIntent(text)
        val steps = decomposeIntent(intent)
        return ExecutionPlan(intent = intent, steps = steps, context = context)
    }
    
    private fun parseIntent(text: String): Intent {
        // Stub — will be replaced with on-device or remote LLM
        return Intent(
            id = java.util.UUID.randomUUID().toString(),
            type = "general",
            text = text,
        )
    }
    
    private fun decomposeIntent(intent: Intent): List<ExecutionStep> {
        // Stub — returns single step for simple intents
        return listOf(ExecutionStep(intent = intent, agentId = null))
    }
}

data class ExecutionPlan(
    val intent: Intent,
    val steps: List<ExecutionStep>,
    val context: AgentContext,
)

data class ExecutionStep(
    val intent: Intent,
    val agentId: String?,
    val dependsOn: List<String> = emptyList(),
)
