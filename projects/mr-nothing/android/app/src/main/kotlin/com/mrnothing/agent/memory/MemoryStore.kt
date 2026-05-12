package com.mrnothing.agent.memory

/**
 * Persistent contextual memory store for MR NOTHING.
 * 
 * Provides both short-term (session) and long-term (persistent) memory.
 * Long-term memory is vector-indexed for semantic retrieval.
 */
interface MemoryStore {
    
    /** Store a memory entry */
    suspend fun store(entry: MemoryEntry): String
    
    /** Retrieve by exact key */
    suspend fun get(key: String): MemoryEntry?
    
    /** Semantic search — find memories related to a query */
    suspend fun search(query: String, limit: Int = 5): List<MemoryEntry>
    
    /** Delete a memory */
    suspend fun delete(key: String): Boolean
    
    /** Clear session memory */
    suspend fun clearSession(sessionId: String)
}

data class MemoryEntry(
    val id: String = java.util.UUID.randomUUID().toString(),
    val key: String,
    val content: String,
    val type: MemoryType = MemoryType.FACT,
    val sessionId: String? = null,
    val embedding: FloatArray? = null,
    val metadata: Map<String, Any> = emptyMap(),
    val createdAt: Long = System.currentTimeMillis(),
)

enum class MemoryType {
    FACT,        // Stable factual information
    PREFERENCE,  // User preferences and settings
    TASK,        // Task history and outcomes
    CONTEXT,     // Session context
    RELATIONSHIP // Named entities and relationships
}
