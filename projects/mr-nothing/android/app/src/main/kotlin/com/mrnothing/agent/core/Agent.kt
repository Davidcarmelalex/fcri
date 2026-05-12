package com.mrnothing.agent.core

/**
 * Core agent interface for MR NOTHING.
 * 
 * Every agent capability must implement this interface.
 * Follows the Plan → Execute → Report lifecycle.
 */
interface Agent {
    val id: String
    val name: String
    val capabilities: List<String>
    
    /**
     * Determine if this agent can handle the given intent.
     */
    fun canHandle(intent: Intent): Boolean
    
    /**
     * Execute the given intent and return a result.
     */
    suspend fun execute(intent: Intent, context: AgentContext): AgentResult
}

data class Intent(
    val id: String,
    val type: String,
    val text: String,
    val params: Map<String, Any> = emptyMap(),
    val source: IntentSource = IntentSource.VOICE,
)

enum class IntentSource { VOICE, TEXT, AUTOMATION, SYSTEM }

data class AgentContext(
    val userId: String,
    val sessionId: String,
    val memory: Map<String, Any> = emptyMap(),
)

sealed class AgentResult {
    data class Success(val output: String, val data: Map<String, Any> = emptyMap()) : AgentResult()
    data class Failure(val reason: String, val retryable: Boolean = false) : AgentResult()
    data class Partial(val progress: String, val continuation: suspend () -> AgentResult) : AgentResult()
}
